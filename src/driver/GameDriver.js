
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

	getUsers() {
		return this.room ? this.room.getUsers() : [];
	}

	getPlayers() {
		return this.players;
	}

	findPlayer(seat) {
		return this.players.find((player) => player.getSeat() === seat);
	}

	loadCollection(name) {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const collection = require(`../collection/${name}`);
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

		for (let i = 0; i < cards.length; i++) {
			cards[i].id = i + 1;
		}

		return cards;
	}

	resetDrawPile(cards) {
		this.drawPile.cards = cards;
	}

	/**
	 * Make player draw N cards
	 * @param {Player} player
	 * @param {number} num
	 */
	drawCards(player, num) {
		const cards = this.drawPile.shift(num);
		// TO-DO: Shuffle and shift more cards if there are insufficient cards.

		for (const card of cards) {
			player.handArea.add(card);
		}

		this.broadcastCardMove(cards, this.drawPile, player.handArea, { openTo: player });
	}

	/**
	 * Move cards and broadcast to clients
	 * @param {Card[]} cards
	 * @param {CardArea} from
	 * @param {CardArea} to
	 * @param {object=} options
	 */
	moveCards(cards, from, to, options) {
		cards = cards.filter((card) => from.remove(card));
		for (const card of cards) {
			to.add(card);
		}
		this.broadcastCardMove(cards, from, to, options);
	}

	/**
	 * A player uses a card.
	 * @param {CardUseStruct} use
	 * @return {boolean}
	 */
	useCard(use) {
		if (!use.from || !use.card) {
			return false;
		}

		const { card } = use;
		card.onUse(this, use);

		if (!use.from) {
			return false;
		}

		this.room.broadcast(cmd.UseCard, use.toJSON());

		card.use(this, use);
		return true;
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
			const { user } = options.openTo;
			user.send(cmd.MoveCards, {
				...movePath,
				cards: cards.map((card) => card.toJSON()),
			});
			this.room.broadcastExcept(user, cmd.MoveCards, {
				...movePath,
				cardNum: cards.length,
			});
		} else {
			if (options && options.open) {
				movePath.cards = cards.map((card) => card.toJSON());
			} else {
				movePath.cardNum = cards.length;
			}
			this.room.broadcast(cmd.MoveCards, movePath);
		}
	}
}

module.exports = GameDriver;
