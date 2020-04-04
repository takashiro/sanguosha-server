import { Room, User } from '@karuta/core';
import {
	Command as cmd,
	Card as MetaCard,
	CardArea,
	CardAreaType,
	General,
} from '@karuta/sanguosha-core';

import Action from '../core/Action';
import Config from '../core/Config';

import { ActionMap } from '../cmd';

import EventDriver from './EventDriver';
import GameEvent from './GameEvent';
import Card from './Card';
import Collection from './Collection';
import ServerPlayer from './ServerPlayer';

import CardUse from './CardUse';
import CardEffect from './CardEffect';
import Damage from './Damage';

import CollectionMap from '../collection';
import RecoverStruct from './Recover';
import CardExpenseStruct from './CardExpense';
import CardConstraint from './CardConstraint';

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

	protected config: Config;

	protected collections: Collection[];

	protected drawPile: CardArea;

	protected discardPile: CardArea;

	protected currentPlayer: ServerPlayer | null;

	constructor(room: Room) {
		super();

		this.room = room;
		this.players = [];

		this.config = {
			mode: 'standard',
			capacity: 8,
			requestTimeout: 24 * 3600 * 3600,
		};

		this.collections = [];

		this.drawPile = new CardArea(CardAreaType.DrawPile);
		this.discardPile = new CardArea(CardAreaType.DiscardPile);

		this.currentPlayer = null;
	}

	getName(): string {
		return 'sanguosha';
	}

	setConfig(config: Config): void {
		if (config.mode) {
			this.config.mode = config.mode;
		}

		if (config.capacity) {
			this.config.capacity = config.capacity;
		}
	}

	getConfig(): Config {
		return this.config;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getAction(command: number): Action<any, any> | undefined {
		return ActionMap.get(command);
	}

	async start(): Promise<void> {
		super.start();
		this.room.broadcast(cmd.StartGame);
		await this.trigger(GameEvent.StartingGame);
	}

	getRoom(): Room {
		return this.room;
	}

	getUsers(): User[] {
		return this.room.getUsers();
	}

	getPlayers(): ServerPlayer[] {
		return this.players;
	}

	setPlayers(players: ServerPlayer[]): void {
		this.players = players;
	}

	findPlayer(seat: number): ServerPlayer | undefined {
		return this.players.find((player) => player.getSeat() === seat);
	}

	getAlivePlayers(): ServerPlayer[] {
		return this.players.filter((player) => player.isAlive());
	}

	getAlivePlayersExcept(except: ServerPlayer): ServerPlayer[] {
		return this.players.filter((player) => player.isAlive() && player !== except);
	}

	loadCollection(name: string): void {
		const collection = CollectionMap.get(name);
		if (!collection) {
			return;
		}
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
		this.drawPile.setCards(cards);
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

	summonCard(player: ServerPlayer, cardName: string): void {
		const cards = this.drawPile.getCards();
		const card = cards.find((c) => c.getName() === cardName);
		if (card) {
			this.moveCards([card], this.drawPile, player.getHandArea(), { openTo: player });
		}
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
	 * Check card constraints.
	 * @param player
	 * @param card
	 */
	async isCardAvailable(player: ServerPlayer, card: Card): Promise<boolean> {
		if (!await card.isAvailable(this, player)) {
			return false;
		}

		const constraint = new CardConstraint(player, card);
		await this.trigger(GameEvent.CheckingCardConstraint, constraint);
		return constraint.isAvailable();
	}

	/**
	 * Ask a player to choose and confirm card targets. And then make the card take effect.
	 * @param player
	 * @param card
	 * @return Whether the card takes effect.
	 */
	async playCard(source: ServerPlayer, card: Card): Promise<boolean> {
		if (!await card.isAvailable(this, source)) {
			return false;
		}

		const players = this.getPlayers();
		const targets = [];

		// Request to choose card targets
		const expiry = Date.now() + source.getRequestTimeout();
		while (Date.now() < expiry) {
			const candidates = [];
			for (const target of players) {
				if (await card.targetFilter(this, targets, target, source)) {
					candidates.push(target.getSeat());
				}
			}
			const feasible: boolean = await card.targetFeasible(this, targets, source);

			let reply = null;
			try {
				reply = await source.request(cmd.ChoosePlayer, {
					candidates,
					feasible,
				}, expiry - Date.now());
			} catch (error) {
				// Timed out. Ends play phase.
				return false;
			}

			if (!reply || reply.cancel) {
				// Cancel using the card
				return true;
			}
			if (reply.confirm) {
				break;
			}

			if (!reply.player) {
				return false;
			}

			const target = this.findPlayer(reply.player);
			if (!target) {
				return false;
			}

			const i = targets.indexOf(target);
			if (reply.selected) {
				if (!target || !await card.targetFilter(this, targets, target, source)) {
					// Ends play phase
					return false;
				}
				if (i < 0) {
					targets.push(target);
				}
			} else if (i >= 0) {
				targets.splice(i, 1);
			}
		}

		// Confirm the targets are feasible
		if (!await card.targetFeasible(this, targets, source)) {
			return false;
		}

		const use = new CardUse(source, card);
		use.to = targets;
		await this.useCard(use);

		return true;
	}

	/**
	 * A player uses a card.
	 * @param use
	 * @param origin
	 */
	async useCard(use: CardUse, origin?: CardEffect): Promise<boolean> {
		if (!use.from || !use.card) {
			return false;
		}

		const { card } = use;
		await card.onUse(this, use);

		if (!use.from) {
			return false;
		}

		this.room.broadcast(cmd.UseCard, use.toJSON());
		await this.trigger(GameEvent.SelectingCardTargets, use);

		await card.use(this, use);

		if (use.to.length > 0) {
			this.sortPlayersByActionOrder(use.to);
			for (const target of use.to) {
				const effect = new CardEffect(use, target);
				await this.takeCardEffect(effect);
			}
		} else if (origin) {
			const effect = new CardEffect(use, origin);
			await this.takeCardEffect(effect);
		}

		await card.complete(this, use);

		return true;
	}

	protected async takeCardEffect(effect: CardEffect): Promise<void> {
		await this.trigger(GameEvent.TakingCardEffect, effect);

		const { card } = effect;
		if (!card) {
			return;
		}

		if (effect.isValid()) {
			await card.onEffect(this, effect);
			await card.effect(this, effect);
		}
	}

	async expendCard(expense: CardExpenseStruct): Promise<boolean> {
		if (!expense.player || !expense.card) {
			return false;
		}

		this.room.broadcast(cmd.ExpendCard, expense.toJSON());

		const handArea = expense.player.getHandArea();
		const processArea = expense.player.getProcessArea();
		const cards = [expense.card];
		this.moveCards(cards, handArea, processArea, { open: true });

		// TO-DO: Trigger skills

		this.moveCards(cards, processArea, this.getDiscardPile(), { open: true });
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
	setCurrentPlayer(player: ServerPlayer | null): void {
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

	broadcastCardMove(cards: MetaCard[], from: CardArea, to: CardArea, options?: CardMoveOptions): void {
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
	async damage(damage: Damage): Promise<boolean> {
		if (damage.num <= 0 || !damage.to) {
			return false;
		}

		const hp = damage.to.getHp() - damage.num;
		damage.to.setHp(hp);
		damage.to.broadcastProperty('hp', hp);

		return true;
	}

	/**
	 * Proceed a recover event.
	 * @param recover
	 * @return Whether it takes effect.
	 */
	async recover(recover: RecoverStruct): Promise<boolean> {
		const { to } = recover;
		if (recover.num <= 0 || !to) {
			return false;
		}

		const num = Math.min(to.getMaxHp() - to.getHp(), recover.num);
		if (num > 0) {
			const hp = to.getHp() + num;
			to.setHp(hp);
			to.broadcastProperty('hp', hp);
		}

		return true;
	}
}

export default GameDriver;
