
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

		this.cards = [];
		this.drawPile = new CardArea(CardArea.Type.DrawPile);
		this.discardPile = new CardArea(CardArea.Type.DiscardPile);
	}

	start() {
		this.room.broadcast(cmd.StartGame);
		this.trigger(GameEvent.StartGame);
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

}

module.exports = GameDriver;