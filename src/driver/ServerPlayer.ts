import {
	User,
	Room,
	Method,
} from '@karuta/core';

import {
	Context,
	Player,
	PlayerPhase as Phase,
	Card,
	CardArea,
	CardAreaType,
	CardOptionStruct,
	General,
	Skill,
	SkillArea,
	SkillAreaType,
	SkillOwner,
	Reply,
} from '@karuta/sanguosha-core';

import {
	ChoosePlayerOptions,
	PlayAction,
	Player as AbstractPlayer,
} from '@karuta/sanguosha-pack';

import CardOption from './CardOption';

interface ChooseGeneralOptions {
	timeout: number;
	num: number;
	sameKingdom: boolean;
	forced: boolean;
}

const CHOOSE_GENERAL_DEFAULT_OPTIONS = {
	timeout: 40,
	num: 1,
	sameKingdom: false,
	forced: true,
};

class ServerPlayer extends Player implements AbstractPlayer, SkillOwner {
	protected user: User;

	protected headSkillArea: SkillArea;

	protected headAcquiredSkillArea: SkillArea;

	protected deputySkillArea: SkillArea;

	protected deputyAcquiredSkillArea: SkillArea;

	protected handArea: CardArea;

	protected equipArea: CardArea;

	protected judgeArea: CardArea;

	protected processArea: CardArea;

	protected useCount: Map<string, number>;

	protected useLimit: Map<string, number>;

	protected phases: Phase[];

	protected round: number;

	protected requestTimeout: number;

	constructor(user: User) {
		super();
		this.user = user;

		this.headSkillArea = new SkillArea(SkillAreaType.Head);
		this.headAcquiredSkillArea = new SkillArea(SkillAreaType.HeadAcquired);
		this.deputySkillArea = new SkillArea(SkillAreaType.Deputy);
		this.deputyAcquiredSkillArea = new SkillArea(SkillAreaType.DeputyAcquired);

		this.handArea = new CardArea(CardAreaType.Hand, this);
		this.handArea.setOpen(false);
		this.equipArea = new CardArea(CardAreaType.Equip, this);
		this.judgeArea = new CardArea(CardAreaType.Judge, this);
		this.processArea = new CardArea(CardAreaType.Process, this);

		this.useCount = new Map();
		this.useLimit = new Map();
		this.phases = [];
		this.round = 0;
		this.requestTimeout = 15000;
	}

	getUser(): User {
		return this.user;
	}

	getId(): number {
		return this.user ? this.user.getId() : 0;
	}

	getName(): string {
		return this.user?.getName() || '';
	}

	getRoom(): Room | undefined {
		return this.user?.getRoom();
	}

	getSkillArea(): SkillArea {
		return this.headSkillArea;
	}

	getAcquiredSkillArea(): SkillArea {
		return this.headAcquiredSkillArea;
	}

	getHeadSkillArea(): SkillArea {
		return this.headSkillArea;
	}

	getHeadAcquiredSkillArea(): SkillArea {
		return this.headAcquiredSkillArea;
	}

	getDeputySkillArea(): SkillArea {
		return this.deputySkillArea;
	}

	getDeputyAcquiredSkillArea(): SkillArea {
		return this.deputyAcquiredSkillArea;
	}

	findSkillArea(type: SkillAreaType): SkillArea {
		switch (type) {
		case SkillAreaType.Head:
			return this.getHeadSkillArea();
		case SkillAreaType.Deputy:
			return this.getDeputySkillArea();
		case SkillAreaType.HeadAcquired:
			return this.getHeadAcquiredSkillArea();
		case SkillAreaType.DeputyAcquired:
			return this.getDeputyAcquiredSkillArea();
		default:
			return this.getHeadSkillArea();
		}
	}

	getSkillAreas(): SkillArea[] {
		return [
			this.headSkillArea,
			this.deputySkillArea,
			this.headAcquiredSkillArea,
			this.deputyAcquiredSkillArea,
		];
	}

	hasSkill(skill: Skill): boolean {
		return this.getSkillAreas().some((area) => area.has(skill));
	}

	getHandArea(): CardArea {
		return this.handArea;
	}

	getEquipArea(): CardArea {
		return this.equipArea;
	}

	getJudgeArea(): CardArea {
		return this.judgeArea;
	}

	getProcessArea(): CardArea {
		return this.processArea;
	}

	getCardAreas(): CardArea[] {
		return [
			this.handArea,
			this.equipArea,
			this.judgeArea,
		];
	}

	isEmpty(): boolean {
		for (const area of this.getCardAreas()) {
			if (area.size > 0) {
				return false;
			}
		}
		return true;
	}

	getRound(): number {
		return this.round;
	}

	setRound(round: number): void {
		this.round = round;
	}

	setRequestTimeout(msecs: number): void {
		this.requestTimeout = msecs;
	}

	getRequestTimeout(): number {
		return this.requestTimeout;
	}

	async askForGeneral(generals: General[], options: Partial<ChooseGeneralOptions> = {}): Promise<General[]> {
		const opt: ChooseGeneralOptions = {
			...CHOOSE_GENERAL_DEFAULT_OPTIONS,
			...options,
		};

		let reply: unknown;
		try {
			reply = await this.user.get(Context.General, {
				sameKingdom: !!opt.sameKingdom,
				num: opt.num || 1,
				generals: generals.map((general, i) => ({
					id: i,
					kingdom: general.getKingdom(),
					name: general.getName(),
				})),
			});
		} catch (error) {
			// Timeout
		}

		const chosenGenerals = [];
		if (reply && reply instanceof Array) {
			for (const id of reply) {
				if (id >= 0 && id < generals.length) {
					chosenGenerals.push(generals[id]);
				}
			}
		}

		if (opt.forced && chosenGenerals.length < opt.num && generals.length >= opt.num) {
			let availableGenerals = generals;
			if (opt.sameKingdom && opt.num > 1) {
				const kingdoms = new Map();
				for (const general of generals) {
					const alliances = kingdoms.get(general.getKingdom());
					if (!alliances) {
						kingdoms.set(general.getKingdom(), [general]);
					} else {
						alliances.push(general);
					}
				}

				const availableKingdoms = [];
				for (const [, alliances] of kingdoms) {
					if (alliances.length >= opt.num) {
						availableKingdoms.push(alliances);
					}
				}

				const index = Math.floor(Math.random() * availableKingdoms.length);
				availableGenerals = availableKingdoms[index];
			}

			do {
				const index = Math.floor(Math.random() * availableGenerals.length);
				const chosen = availableGenerals[index];
				if (chosenGenerals.indexOf(chosen) < 0) {
					chosenGenerals.push(chosen);
				}
			} while (chosenGenerals.length < opt.num);
		}

		return chosenGenerals;
	}

	async askForCards(areas: CardArea[], option: CardOption): Promise<Card[]> {
		if (areas.length <= 0) {
			return [];
		}
		if (option.minNum < 0) {
			throw new Error('minNum must be >= 0');
		}
		if (option.maxNum < option.minNum) {
			throw new Error('maxNum must be >= minNum.');
		}

		let reply = null;

		const { pattern } = option;
		const acceptableCards = [];
		for (const area of areas) {
			const cards = area.getCards();
			if (pattern) {
				acceptableCards.push(...cards.filter((card) => pattern.match(card)));
			} else {
				acceptableCards.push(...cards);
			}
		}

		if (option.autoSkip && acceptableCards.length <= 0) {
			return [];
		}

		try {
			const args: CardOptionStruct = {
				areas: areas.map((area) => area.toJSON()),
				minNum: option.minNum,
				maxNum: option.maxNum,
				cards: pattern ? acceptableCards.map((card) => card.getId()) : undefined,
			};
			reply = await this.user.get(Context.CardSelection, args);
		} catch (error) {
			// No response from client
		}

		const cardSet = new Set<Card>();
		if (reply instanceof Array) {
			for (const cardId of reply) {
				const card = acceptableCards.find((c) => c.getId() === cardId);
				if (card) {
					cardSet.add(card);
				}
			}
		}

		let selected = Array.from(cardSet);
		if (pattern) {
			selected = selected.filter((card) => pattern.match(card));
		}
		if (selected.length < option.minNum) {
			const delta = Math.min(option.minNum - selected.length, acceptableCards.length - selected.length);
			const otherCards = acceptableCards.filter((card) => !selected.includes(card));
			selected.push(...otherCards.slice(0, delta));
		} else if (selected.length > option.maxNum) {
			const delta = selected.length - option.maxNum;
			selected.splice(0, delta);
		}

		return selected;
	}

	async askForPlayers(players: AbstractPlayer[], options: ChoosePlayerOptions): Promise<Reply<number[]>> {
		const reply = await this.user.get(Context.PlayerSelection, { players, options });
		return reply as Reply<number[]>;
	}

	updateProperty(prop: string, value: unknown): void {
		this.user.patch(Context.Player, {
			uid: this.getId(),
			prop,
			value,
		});
	}

	broadcastProperty(prop: string, value: unknown): void {
		const room = this.getRoom();
		if (!room) {
			return;
		}

		room.broadcast(Method.Patch, Context.Player, {
			uid: this.getId(),
			prop,
			value,
		});
	}

	addUseCount(name: string, delta: number): void {
		const count = this.getUseCount(name);
		this.useCount.set(name, count + delta);
	}

	getUseCount(name: string): number {
		return this.useCount.get(name) || 0;
	}

	resetUseCount(name: string): void {
		this.useCount.set(name, 0);
	}

	clearUseCount(): void {
		this.useCount.clear();
	}

	getUseLimit(name: string): number {
		return this.useLimit.get(name) || Infinity;
	}

	setUseLimit(name: string, limit: number): void {
		this.useLimit.set(name, limit);
	}

	resetUseLimit(name: string): void {
		this.useLimit.delete(name);
	}

	clearUseLimit(): void {
		this.useLimit.clear();
	}

	setPhases(phases: Phase[]): void {
		this.phases = [...phases];
	}

	getPhases(): Phase[] {
		return [...this.phases];
	}

	skipPhase(phase: Phase): boolean {
		const cur = this.phases.indexOf(this.getPhase());
		const i = this.phases.indexOf(phase, cur + 1);
		if (i >= 0) {
			this.phases.splice(i, 1);
			return true;
		}
		return false;
	}

	async play(availableCards: Card[]): Promise<PlayAction | null> {
		let reply: unknown;
		try {
			reply = await this.user.get(Context.Play, {
				cards: availableCards.map((card) => card.getId()),
			});
		} catch (error) {
			return null;
		}
		if (!reply || typeof reply !== 'object') {
			return null;
		}

		const res = reply as Record<string, unknown>;
		if (!res.skill) {
			const { cards } = res;
			if (!Array.isArray(cards)) {
				return null;
			}

			const [cardId] = cards;
			if (!cardId || typeof cardId !== 'number') {
				return null;
			}

			const card = availableCards.find((c) => c.getId() === cardId);
			if (!card) {
				return null;
			}

			return { card };
		}

		// TO-DO: Invoke a proactive skill.
		return null;
	}

	async invokeSkill(skills: string[]): Promise<number> {
		let reply = -1;
		try {
			reply = await this.user.post(Context.Skill, skills) as number;
		} catch (error) {
			return -1;
		}

		if (!Number.isInteger(reply) || reply < 0 || reply >= skills.length) {
			return -1;
		}

		return reply;
	}
}

export default ServerPlayer;
