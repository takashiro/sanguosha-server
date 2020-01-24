import { Room, User } from '@karuta/core';
import {
	Command as cmd,
	Card as MetaCard,
	CardArea,
	CardAreaType,
	General,
} from '@karuta/sanguosha-core';

import EventDriver from './EventDriver';
import GameEvent from './GameEvent';
import Card from './Card';
import ServerPlayer from './ServerPlayer';
import CardUseStruct from './CardUseStruct';
import CardEffectStruct from './CardEffectStruct';
import DamageStruct from './DamageStruct';
import Collection from './Collection';

interface CardMoveOptions {
	openTo?: ServerPlayer;
	open?: boolean;
}

interface CardMovePath {
	from: object;
	to: object;
	cards?: object[];
	cardNum?: number;
}

class GameDriver extends EventDriver<GameEvent> {
	protected readonly room: Room;

	protected players: ServerPlayer[];

	protected capacity: number;

	protected collections: Collection[];

	protected drawPile: CardArea;

	protected discardPile: CardArea;

	protected currentPlayer: ServerPlayer | null;

	constructor(room: Room) {
		super();

		this.room = room;
		this.players = [];
		this.capacity = 8;

		this.collections = [];

		this.drawPile = new CardArea(CardAreaType.DrawPile);
		this.discardPile = new CardArea(CardAreaType.DiscardPile);

		this.currentPlayer = null;
	}

	async start(): Promise<void> {
		super.start();
		this.room.broadcast(cmd.StartGame);
		await this.trigger(GameEvent.StartGame);
	}

	getUsers(): User[] {
		return this.room.getUsers();
	}

	getPlayers(): ServerPlayer[] {
		return this.players;
	}

	findPlayer(seat: number): ServerPlayer | undefined {
		return this.players.find((player) => player.getSeat() === seat);
	}

	getAlivePlayers(): ServerPlayer[] {
		return this.players.filter((player) => player.isAlive());
	}

	loadCollection(name: string): void {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const collection = require(`../collection/${name}`);
		this.collections.push(collection);
	}

	getGenerals(): General[] {
		const generals = [];
		for (const col of this.collections) {
			generals.push(...col.getGenerals());
		}
		return generals;
	}

	createCards(): Card[] {
		const cards = [];
		for (const col of this.collections) {
			cards.push(...col.createCards());
		}

		for (let i = 0; i < cards.length; i++) {
			cards[i].setId(i + 1);
		}

		return cards;
	}

	getDrawPile(): CardArea {
		return this.drawPile;
	}

	resetDrawPile(cards: Card[]): void {
		this.drawPile.cards = cards;
	}

	getDiscardPile(): CardArea {
		return this.discardPile;
	}

	/**
	 * Make player draw N cards
	 * @param player
	 * @param num
	 */
	drawCards(player: ServerPlayer, num: number): void {
		const cards = this.drawPile.shift(num);
		// TO-DO: Shuffle and shift more cards if there are insufficient cards.

		const area = player.getHandArea();
		for (const card of cards) {
			area.add(card);
		}

		this.broadcastCardMove(cards, this.drawPile, area, { openTo: player });
	}

	/**
	 * Move cards and broadcast to clients
	 * @param cards
	 * @param from
	 * @param to
	 * @param options
	 */
	moveCards(cards: MetaCard[], from: CardArea, to: CardArea, options?: CardMoveOptions): void {
		cards = cards.filter((card) => from.remove(card));
		for (const card of cards) {
			to.add(card);
		}
		this.broadcastCardMove(cards, from, to, options);
	}

	/**
	 * A player uses a card.
	 * @param use
	 */
	async useCard(use: CardUseStruct): Promise<boolean> {
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
	 * @return current player.
	 */
	getCurrentPlayer(): ServerPlayer | null {
		return this.currentPlayer;
	}

	/**
	 * Set current player.
	 * @param player
	 */
	setCurrentPlayer(player: ServerPlayer): void {
		this.currentPlayer = player;
	}

	/**
	 * Sort players by action order
	 * @param players
	 */
	sortPlayersByActionOrder(players: ServerPlayer[]): void {
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
	getRelativeSeat(player: ServerPlayer): number {
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

	broadcastCardMove(cards: MetaCard[], from: CardArea, to: CardArea, options?: CardMoveOptions) {
		if (!this.room) {
			return;
		}

		const movePath: CardMovePath = {
			from: from.toJSON(),
			to: to.toJSON(),
		};

		if (options && options.openTo) {
			const user = options.openTo.getUser();
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
	 * @param from
	 * @param to
	 * @return distance between the 2 players
	 */
	async getDistance(from: ServerPlayer, to: ServerPlayer): Promise<number> {
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
	 * @param source
	 * @param target
	 */
	async isInAttackRange(source: ServerPlayer, target: ServerPlayer): Promise<boolean> {
		if (source === target) {
			return false;
		}

		const range = source.getAttackRange();
		const dist = await this.getDistance(source, target);
		return range >= dist;
	}

	/**
	 * Proceed a damage event.
	 * @param damage
	 * @return Whether it takes effect.
	 */
	async damage(damage: DamageStruct): Promise<boolean> {
		if (damage.num <= 0 || !damage.to) {
			return false;
		}

		const hp = damage.to.getHp() - damage.num;
		damage.to.setHp(hp);
		damage.to.broadcastProperty('hp', hp);

		return true;
	}
}

export default GameDriver;
