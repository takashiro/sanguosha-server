
const cmd = require('../cmd');
const CardArea = require('../core/CardArea');
const ServerPlayer = require('./ServerPlayer');
const GameEvent = require('./GameEvent');
const {shuffle} = require('../core/util');

class GameDriver {

	constructor(room) {
		this.room = room;
		this.players = [];
		this.capacity = 8;

		this.cards = [null];
		this.drawPile = new CardArea(CardArea.Type.DrawPile);
		this.discardPile = new CardArea(CardArea.Type.DiscardPile);

		this._handlers = new Map;
	}

	start() {
		this.room.broadcast(cmd.StartGame);
		this.arrangeSeats();
		this.trigger(GameEvent.StartGame);
	}

	arrangeSeats() {
		let users = this.room.users;
		this.players = Array.from(users);
		for (let i = 0; i < this.players.length; i++) {
			let player = new ServerPlayer(this.players[i]);
			player.seat = i + 1;
			this.players[i] = player;
		}

		let args = [];
		for (let player of this.players) {
			args.push({
				uid: player.user.id,
				seat: player.seat,
				name: player.user.name,
			});
		}
		this.room.broadcast(cmd.ArrangeSeats, args);
	}

	async arrangeGenerals() {
		let generals = [];
		const collections = require('../collection');
		for (let collection of collections) {
			generals.push(...collection.generals);
		}

		let candidateNum = 7;
		let players = this.players;
		shuffle(generals);
		generals = generals.splice(0, candidateNum * players.length);

		let sessions = players.map(player => ({
			player: player,
			candidates: [],
			selected: [],
		}));
		for (let i = 0, j = 0; i < generals.length; i++) {
			let session = sessions[j];
			session.candidates.push(generals[i]);
			j++;
			if (j >= sessions.length) {
				j = 0;
			}
		}

		let replies = [];
		for (let s of sessions) {
			replies.push(
				s.player.askForGeneral(s.candidates, {
					timeout: 5, //TO-DO: make this longer
					num: 2,
					sameKingdom: true,
					forced: true,
				}).then(generals => {
					s.selected = generals;
				})
			);
		}

		await Promise.all(replies);
		for (let s of sessions) {
			let player = s.player;
			let headGeneral = s.selected[0];
			let deputyGeneral = s.selected[1];
			player.setHeadGeneral(headGeneral);
			player.broadcastProperty('headGeneral', headGeneral.toJSON());
			player.setDeputyGeneral(deputyGeneral);
			player.broadcastProperty('deputyGeneral', deputyGeneral.toJSON());

			let hp = headGeneral.headMaxHp() + deputyGeneral.deputyMaxHp();
			if (hp & 1) {
				player.halfHp = true;
			}
			hp = Math.floor(hp / 2);
			player.setHp(hp);
			player.setMaxHp(hp);
			player.broadcastProperty('maxHp', hp);
			player.broadcastProperty('hp', hp);
		}
	}

	arrangeCards() {
		this.loadCards();

		// Load draw pile
		this.drawPile.cards = this.cards.slice(1);
		shuffle(this.drawPile.cards);

		// Initialize hand cards
		for (let player of this.players) {
			this.drawCards(player, 4);
		}
	}

	loadCards() {
		// Load cards
		const collections = require('../collection');
		for (let collection of collections) {
			this.cards.push(...collection.createCards());
		}

		// Assign card id
		for (let i = 1; i < this.cards.length; i++) {
			this.cards[i]._id = i;
		}
	}

	drawCards(player, num) {
		let cards = [];
		for (let i = 0; i < num; i++) {
			cards.push(this.drawPile.takeFirst());
		}

		for (let card of cards) {
			player.handArea.add(card);
		}

		let movePath = {
			from: this.drawPile.toJSON(),
			to: player.handArea.toJSON(),
		};
		player.user.send(cmd.MoveCards, {
			...movePath,
			cards: cards.map(card => card.toJSON())
		});
		this.room.broadcastExcept(player.user, cmd.MoveCards, {
			...movePath,
			cardNum: cards.length,
		});
	}

	register(event, handler) {
		let handlers = this._handlers.get(event);
		if (!handlers) {
			handlers = [];
			this._handlers.set(event, handlers);
		}

		handlers.push(handler);
	}

	async trigger(event, player = null, data = null) {
		let handlers = this._handlers.get(event);
		if (!handlers) {
			return;
		}

		let triggerable_handlers = handlers.filter(handler => handler.triggerable(this, player, data));
		for (let handler of triggerable_handlers) {
			if (await handler.cost(this, player, data)) {
				let prevented = await handler.effect(this, player, data);
				if (prevented) {
					break;
				}
			}
		}
	}

}

module.exports = GameDriver;
