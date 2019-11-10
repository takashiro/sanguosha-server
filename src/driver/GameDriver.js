
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

		this.currentPlayer = null;
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

	getAlivePlayers() {
		return this.players.filter((player) => player.isAlive());
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

	/**
	 * Get current player.
	 * @return {ServerPlayer}
	 */
	getCurrentPlayer() {
		return this.currentPlayer;
	}

	/**
	 * Set current player.
	 * @param {ServerPlayer} player
	 */
	setCurrentPlayer(player) {
		this.currentPlayer = player;
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

	/**
	 * Calculate the distance from a player to another.
	 * @param {ServerPlayer} from
	 * @param {ServerPlayer} to
	 * @return {Promise<number>}
	 */
	async getDistance(from, to) {
		if (from.isDead() || to.isDead()) {
			return Infinity;
		}

		const players = this.getAlivePlayers();
		const maxDist = Math.floor(players.length / 2);
		const dist = Math.abs(players.indexOf(from) - players.indexOf(to));
		return dist <= maxDist ? dist : players.length - dist;
	}

	/**
	 * Check if a player is in one's attack range.
	 * @param {ServerPlayer} source
	 * @param {ServerPlayer} target
	 * @return {Promise<boolean>}
	 */
	async isInAttackRange(source, target) {
		const range = source.getAttackRange();
		const dist = await this.getDistance(source, target);
		return range >= dist;
	}

	/**
	 * Proceed a damage event.
	 * @param {DamageStruct} damage
	 * @return {boolean} Whether it takes effect.
	 */
	async damage(damage) {
		if (damage.num <= 0 || !damage.to) {
			return false;
		}

		const hp = damage.to.getHp() - damage.num;
		damage.to.setHp(hp);
		damage.to.broadcastProperty('hp', hp);

		return true;
	}
}

module.exports = GameDriver;
