import {
	Method,
	ContextListener,
	Driver as KarutaDriver,
	DriverProfile,
	Room,
	User,
} from '@karuta/core';
import {
	Context,
	Card as MetaCard,
	CardArea,
	CardAreaType,
	GameConfig,
	General,
	Reply,
	ReplyType,
	Skill,
	SkillChangeStruct,
	SkillAreaType,
} from '@karuta/sanguosha-core';

import {
	Card,
	CardEffect,
	CardExpense,
	CardUse,
	CardMove,
	CardMoveOptions,
	InstantCardEffect,
	Collection,
	EventType as GameEvent,
	GameDriver as SanguoshaDriver,
	Skill as EventSkill,
	Damage,
	Recover,
	Player,
	Judgement,
	DistanceVector,
} from '@karuta/sanguosha-pack';

import CardConstraint from './CardConstraint';

import actions from '../cmd';
import shuffle from '../util/shuffle';

import EventDriver from './EventDriver';
import { loader as collectionLoader } from './CollectionLoader';

class GameDriver extends EventDriver implements KarutaDriver<GameConfig>, SanguoshaDriver {
	protected readonly room: Room;

	protected players: Player[] = [];

	protected config: GameConfig = {
		mode: 'standard',
		capacity: 8,
		requestTimeout: 24 * 3600 * 3600,
	};

	protected collections: Collection[] = [];

	protected drawPile = new CardArea(CardAreaType.DrawPile);

	protected discardPile = new CardArea(CardAreaType.DiscardPile);

	protected wuguArea = new CardArea(CardAreaType.Wugu);

	protected currentPlayer?: Player;

	constructor(room: Room) {
		super();

		this.room = room;
		this.drawPile.setOpen(false);
	}

	getProfile(): DriverProfile<GameConfig> {
		throw new Error('Method not implemented.');
	}

	updateConfig(config: GameConfig): void {
		Object.assign(this.config, config);
	}

	createContextListeners(user: User): ContextListener[] {
		return actions.map((Action) => new Action(this, user));
	}

	getName(): string {
		return 'sanguosha';
	}

	setConfig(config: GameConfig): void {
		if (config.mode) {
			this.config.mode = config.mode;
		}

		if (config.capacity) {
			this.config.capacity = config.capacity;
		}
	}

	getConfig(): GameConfig {
		return this.config;
	}

	async start(): Promise<void> {
		super.start();
		this.room.broadcast(Method.Post, Context.Game);
		await this.trigger<void>(GameEvent.StartingGame, undefined);
	}

	getRoom(): Room {
		return this.room;
	}

	getUsers(): User[] {
		return this.room.getUsers();
	}

	getPlayers(): Player[] {
		return this.players;
	}

	setPlayers(players: Player[]): void {
		this.players = players;
	}

	findPlayer(seat: number): Player | undefined {
		return this.players.find((player) => player.getSeat() === seat);
	}

	getAlivePlayers(): Player[] {
		return this.players.filter((player) => player.isAlive());
	}

	getAlivePlayersExcept(except: Player): Player[] {
		return this.players.filter((player) => player.isAlive() && player !== except);
	}

	async loadCollection(name: string): Promise<void> {
		const CollectionCreator = await collectionLoader.get(name);
		if (!CollectionCreator) {
			return;
		}
		const col = new CollectionCreator();
		this.collections.push(col);
	}

	getGenerals(): General[] {
		const generals = [];
		for (const col of this.collections) {
			generals.push(...col.getGenerals());
		}
		return generals;
	}

	prepareDrawPile(): void {
		const cards = this.createCards();
		for (const card of cards) {
			card.setLocation(this.drawPile);
		}
		shuffle(cards);
		this.drawPile.setCards(cards);
	}

	fillDrawPile(minNum = 0): void {
		if (this.drawPile.size > minNum) {
			return;
		}

		const cards = this.discardPile.getCards();
		this.discardPile.setCards([]);

		shuffle(cards);
		for (const card of cards) {
			this.drawPile.add(card);
			(card as Card).setLocation(this.drawPile);
		}
	}

	getDrawPile(): CardArea {
		return this.drawPile;
	}

	getDiscardPile(): CardArea {
		return this.discardPile;
	}

	getWuguArea(): CardArea {
		return this.wuguArea;
	}

	getCardsFromDrawPile(num: number): MetaCard[] {
		this.fillDrawPile(num);
		const cards = this.drawPile.getCards().slice(0, num);
		return cards;
	}

	/**
	 * Make player draw N cards
	 * @param player
	 * @param num
	 */
	async drawCards(player: Player, num: number): Promise<void> {
		const cards = this.getCardsFromDrawPile(num);
		await this.moveCards(cards, player.getHandArea(), { openTo: [player] });
	}

	async summonCard(player: Player, cardName: string): Promise<void> {
		const cards = this.drawPile.getCards();
		const card = cards.find((c) => c.getName() === cardName);
		if (card) {
			await this.moveCards([card], player.getHandArea(), { openTo: [player] });
		}
	}

	/**
	 * Move cards and broadcast to clients
	 * @param cards
	 * @param to
	 * @param options
	 */
	async moveCards(cards: MetaCard[], to: CardArea, options: CardMoveOptions): Promise<void> {
		const sourceMap = new Map<CardArea, Card[]>();
		for (const card of cards as Card[]) {
			const location = card.getLocation();
			if (!location || !location.has(card)) {
				continue;
			}

			const peers = sourceMap.get(location);
			if (peers) {
				peers.push(card);
			} else {
				sourceMap.set(location, [card]);
			}
		}

		const moves: CardMove[] = [];
		for (const [from, subset] of sourceMap) {
			const move = new CardMove(from, to, subset);
			moves.push(move);
		}

		await this.trigger(GameEvent.BeforeMovingCards, moves);

		if (moves.length <= 0) {
			return;
		}

		for (const move of moves) {
			const moved = [];
			for (const card of move.cards) {
				if (!move.from.remove(card)) {
					continue;
				}

				move.to.add(card);
				(card as Card).setLocation(move.to);
				moved.push(card);
			}
			move.cards = moved;
		}
		this.broadcastCardMove(moves, options);

		await this.trigger(GameEvent.AfterMovingCards, moves);
	}

	/**
	 * Check card constraints.
	 * @param player
	 * @param card
	 */
	async isCardAvailable(player: Player, card: Card): Promise<boolean> {
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
	async playCard(source: Player, card: Card): Promise<boolean> {
		if (!await card.isAvailable(this, source)) {
			return false;
		}

		const players = this.getPlayers();
		const targets = [];

		// Request to choose card targets
		const expiry = Date.now() + source.getRequestTimeout();
		while (Date.now() < expiry) {
			const candidates: Player[] = [];
			for (const target of players) {
				if (await card.filterPlayer(this, targets, target, source)) {
					candidates.push(target);
				}
			}
			const feasible: boolean = await card.isFeasible(this, targets, source);

			let reply: Reply<number[]>;
			try {
				reply = await source.askForPlayers(candidates, {
					minNum: 1,
					maxNum: 1,
					feasible,
				});
			} catch (error) {
				// Timed out. Ends play phase.
				return false;
			}

			if (!reply || reply.type === ReplyType.Cancel) {
				// Cancel using the card
				return true;
			}
			if (reply.type === ReplyType.Confirm) {
				break;
			}

			if (!reply.data || reply.data.length !== 1) {
				return false;
			}

			const target = this.findPlayer(reply.data[0]);
			if (!target) {
				return false;
			}

			const i = targets.indexOf(target);
			if (i < 0) {
				// To select a player
				if (await card.filterPlayer(this, targets, target, source)) {
					targets.push(target);
				}
			} else {
				// To unselect a player
				targets.splice(i, 1);
			}
		}

		// Confirm the targets are feasible
		if (!await card.isFeasible(this, targets, source)) {
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

		const card = use.card as Card;
		await card.onUse(this, use);

		if (!use.from) {
			return false;
		}

		this.room.broadcast(Method.Post, Context.CardUse, use.toJSON());
		await this.trigger(GameEvent.SelectingCardTargets, use);

		const instant = await card.use(this, use);
		await this.trigger(GameEvent.UsingCard, use);

		if (use.to.length > 0) {
			const effective = await this.confirmCardTargets(use);
			if (effective) {
				if (instant) {
					for (const target of use.to) {
						const effect = new InstantCardEffect(use, target);
						await this.takeCardEffect(effect);
					}
				}
			} else {
				await this.moveCards([use.card], this.discardPile, { open: true });
			}
		} else if (origin) {
			const effect = new InstantCardEffect(use, origin);
			await this.takeCardEffect(effect);
		}

		if (instant) {
			await card.complete(this, use);
		}
		await this.trigger(GameEvent.AfterUsingCard, use);

		return true;
	}

	protected async confirmCardTargets(use: CardUse): Promise<boolean> {
		const events = [
			GameEvent.ConfirmingCardTargets,
			GameEvent.BeingCardTargets,
			GameEvent.AfterConfirmingCardTargets,
			GameEvent.AfterBeingCardTargets,
		];
		for (const event of events) {
			await this.trigger(event, use);
			if (use.to.length <= 0) {
				return false;
			}
		}

		this.sortPlayersByActionOrder(use.to);
		return true;
	}

	async takeCardEffect(effect: CardEffect): Promise<void> {
		if (await this.trigger(GameEvent.PreparingCardEffect, effect)) {
			return;
		}

		await this.trigger(GameEvent.BeforeTakingCardEffect, effect);
		if (effect.isValid()) {
			await this.trigger(GameEvent.TakingCardEffect, effect);
			const card = effect.card as Card;
			await card.onEffect(this, effect);
			await card.effect(this, effect);
		}
	}

	async expendCard(expense: CardExpense): Promise<boolean> {
		if (!expense.player || !expense.card) {
			return false;
		}

		this.room.broadcast(Method.Post, Context.CardExpense, expense.toJSON());

		const processArea = expense.player.getProcessArea();
		const cards = [expense.card];
		await this.moveCards(cards, processArea, { open: true });

		// TO-DO: Trigger skills

		if (processArea.has(expense.card)) {
			await this.moveCards(cards, this.getDiscardPile(), { open: true });
		}
		return true;
	}

	/**
	 * @return current player.
	 */
	getCurrentPlayer(): Player | undefined {
		return this.currentPlayer;
	}

	/**
	 * Set current player.
	 * @param player
	 */
	setCurrentPlayer(player?: Player): void {
		this.currentPlayer = player;
	}

	/**
	 * Sort players by action order
	 * @param players
	 */
	sortPlayersByActionOrder(players: Player[]): void {
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
	 * @param {Player} player
	 * @return {number}
	 */
	getRelativeSeat(player: Player): number {
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

	/**
	 * Calculate the distance from a player to another.
	 * @param from
	 * @param to
	 * @return distance between the 2 players
	 */
	async getDistance(from: Player, to: Player): Promise<number> {
		if (from.isDead() || to.isDead()) {
			return Infinity;
		}

		const players = this.getAlivePlayers();
		const maxDistance = Math.floor(players.length / 2);
		const edge = Math.abs(players.indexOf(from) - players.indexOf(to));
		const distance = edge <= maxDistance ? edge : players.length - edge;

		const vector = new DistanceVector(from, to, distance);
		await this.trigger(GameEvent.CalculatingDistance, vector);

		return vector.distance;
	}

	/**
	 * Check if a player is in one's attack range.
	 * @param source
	 * @param target
	 */
	async isInAttackRange(source: Player, target: Player): Promise<boolean> {
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

		const preEvents = [
			GameEvent.BeforeStartingDamage,
			GameEvent.StartingDamage,
			GameEvent.Damaging,
			GameEvent.Damaged,
		];
		for (const event of preEvents) {
			const prevented = await this.trigger(event, damage);
			if (prevented) {
				return false;
			}
		}

		const hp = damage.to.getHp() - damage.num;
		damage.to.setHp(hp);
		damage.to.broadcastProperty('hp', hp);

		const postEvents = [
			GameEvent.AfterDamaging,
			GameEvent.AfterDamaged,
			GameEvent.EndingDamage,
			GameEvent.AfterEndingDamage,
		];
		for (const event of postEvents) {
			const prevented = await this.trigger(event, damage);
			if (prevented) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Proceed a recover event.
	 * @param recover
	 * @return Whether it takes effect.
	 */
	async recover(recover: Recover): Promise<boolean> {
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

	async judge(judgement: Judgement): Promise<void> {
		const judged = await this.trigger(GameEvent.Judging, judgement);

		if (!judged) {
			this.fillDrawPile(1);
			const card = this.drawPile.first();
			if (!card) {
				// TO-DO: fair
				return;
			}

			judgement.change(card);
		}

		const card = judgement.getCard();
		if (!card) {
			return;
		}

		const { player } = judgement;
		const processArea = player.getProcessArea();
		await this.moveCards([card], processArea, { open: true });
		this.room.broadcast(Method.Post, Context.Judge, judgement.toJSON());

		await this.trigger(GameEvent.BeforeIssuingJudgement, judgement);
		judgement.execute();
		const moved = await this.trigger(GameEvent.AfterIssuingJudgement, judgement);
		if (!moved) {
			const cards = judgement.cards.filter((carta) => processArea.has(carta));
			await this.moveCards(cards, this.discardPile, { open: true });
		}
	}

	addSkill(player: Player, skill: Skill, areaType: SkillAreaType = SkillAreaType.HeadAcquired): boolean {
		const area = player.findSkillArea(areaType);
		if (!area.add(skill)) {
			return false;
		}

		if (skill instanceof EventSkill) {
			const effects = skill.getEffects();
			for (const effect of effects) {
				this.register(effect);
			}
		}

		const change: SkillChangeStruct = {
			name: skill.getName(),
			tags: Array.from(skill.getTags()),
			owner: player.getSeat(),
			area: areaType,
		};
		this.room.broadcast(Method.Put, Context.Skill, change);
		return true;
	}

	removeSkill(player: Player, skill: Skill, areaType: SkillAreaType = SkillAreaType.HeadAcquired): boolean {
		const area = player.findSkillArea(areaType);
		if (!area.remove(skill)) {
			return false;
		}

		if (skill instanceof EventSkill) {
			const effects = skill.getEffects();
			for (const effect of effects) {
				this.unregister(effect);
			}
		}

		const change: SkillChangeStruct = {
			name: skill.getName(),
			tags: Array.from(skill.getTags()),
			owner: player.getSeat(),
			area: areaType,
		};
		this.room.broadcast(Method.Delete, Context.Skill, change);
		return true;
	}

	protected createCards(): Card[] {
		const cards = [];
		for (const col of this.collections) {
			cards.push(...col.createCards());
		}

		for (let i = 0; i < cards.length; i++) {
			cards[i].setId(i + 1);
		}

		return cards;
	}

	protected broadcastCardMove(moves: CardMove[], options: CardMoveOptions): void {
		if (!this.room) {
			return;
		}

		for (const move of moves) {
			if (options.open || move.from.isOpen() || move.to.isOpen()) {
				this.room.broadcast(Method.Post, Context.CardLocation, move.toJSON(true));
			} else if (options.openTo) {
				for (const openTo of options.openTo) {
					const user = Reflect.get(openTo, 'user') as User;
					user.post(Context.CardLocation, move.toJSON(true));
				}
				for (const player of this.players) {
					if (options.openTo.includes(player)) {
						continue;
					}
					const user = Reflect.get(player, 'user') as User;
					user.post(Context.CardLocation, move.toJSON(false));
				}
			} else {
				this.room.broadcast(Method.Post, Context.CardLocation, move.toJSON(false));
			}
		}
	}
}

export default GameDriver;
