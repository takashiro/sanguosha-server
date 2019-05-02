
const cmd = require('../cmd');
const CardArea = require('../core/CardArea');
const GameEvent = require('./GameEvent');
const EventDriver = require('./EventDriver');

class GameDriver extends EventDriver {

	constructor(room) {
		super();

		this.room = room;
		this.players = [];
		this.capacity = 8;

		this.collections = [];

		this.drawPile = new CardArea(CardArea.Type.DrawPile);
		this.discardPile = new CardArea(CardArea.Type.DiscardPile);
	}

	async start() {
		super.start();
		this.room.broadcast(cmd.StartGame);
		await this.trigger(GameEvent.StartGame);
	}

	loadCollection(name) {
		const collection = require('../collection/' + name);
		this.collections.push(collection);
	}

	createGenerals() {
		const generals = [];
		for (const col of this.collections) {
			generals.push(...col.createGenerals());
		}
		return generals;
	}

	createCards() {
		const cards = [];
		for (const col of this.collections) {
			cards.push(...col.createCards());
		}
		return cards;
	}

	resetDrawPile(cards) {
		this.drawPile.cards = cards;
	}

	drawCards(player, num) {
		const cards = this.drawPile.shift(num);
		//TO-DO: Shuffle and shift more cards if there are insufficient cards.

		for (const card of cards) {
			player.handArea.add(card);
		}

		this.broadcastCardMove(cards, this.drawPile, player.handArea, {openTo: player});
	}

	broadcastCardMove(cards, from, to, options = null) {
		if (!this.room) {
			return;
		}

		const movePath = {
			from: from.toJSON(),
			to: to.toJSON(),
		};

		if (options && options.openTo) {
			const user = options.openTo.user;
			user.send(cmd.MoveCards, {
				...movePath,
				cards: cards.map(card => card.toJSON())
			});
			this.room.broadcastExcept(user, cmd.MoveCards, {
				...movePath,
				cardNum: cards.length,
			});
		} else {
			if (options && options.open) {
				movePath.cards = cards.map(card => card.toJSON());
			} else {
				movePath.cardNum = cards.length;
			}
			this.room.broadcast(cmd.MoveCards, movePath);
		}
	}

}

module.exports = GameDriver;
