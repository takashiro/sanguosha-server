
const cmd = require('../cmd');
const CardArea = require('../core/CardArea');
const GameEvent = require('./GameEvent');
const EventDriver = require('./EventDriver');
const CardEffectStruct = require('./CardEffectStruct');

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

	getDrawPile() {
		return this.drawPile;
	}

	resetDrawPile(cards) {
		this.drawPile.cards = cards;
	}

	getDiscardPile() {
		return this.discardPile;
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
	 * @return {<Promise<boolean>}
	 */
	async useCard(use) {
		if (!use.from || !use.card) {
			return false;
		}

		const { card } = use;
		await card.onUse(this, use);

		if (!use.from) {
			return false;
		}

		this.room.broadcast(cmd.UseCard, use.toJSON());

		await card.use(this, use);

		if (use.to.length > 1) {
			this.sortPlayersByActionOrder(use.to);
		}

		for (const target of use.to) {
			const effect = new CardEffectStruct(use, target);
			await card.onEffect(this, effect);
			await card.effect(this, effect);
		}

		await card.complete(this, use);

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

	/**
	 * Sort players by action order
	 * @param {ServerPlayer[]} players
	 */
	sortPlayersByActionOrder(players) {
		if (!this.currentPlayer) {
			return;
		}

		players.sort((p1, p2) => {
			const s1 = this.getRelativeSeat(p1);
			const s2 = this.getRelativeSeat(p2);
			return s1 - s2;
		});
	}

	/**
	 * Get a player seat number relative to the current player.
	 * @param {ServerPlayer} player
	 * @return {number}
	 */
	getRelativeSeat(player) {
		if (!this.currentPlayer) {
			return NaN;
		}

		const current = this.currentPlayer.getSeat();
		let seat = player.getSeat() - current;
		if (seat < 0) {
			seat += this.players.length;
		}
		return seat;
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
		if (source === target) {
			return false;
		}

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
