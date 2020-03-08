import {
	User,
	Room,
} from '@karuta/core';

import {
	Command as cmd,
	Player,
	Card,
	CardArea,
	CardAreaType,
	General,
} from '@karuta/sanguosha-core';

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

interface AskForCardOptions {
	num: number;
}

type PropertyValue = string | number | boolean | object | null;

interface PlayAction {
	card?: Card;
}

class ServerPlayer extends Player {
	protected user: User;

	protected handArea: CardArea;

	protected equipArea: CardArea;

	protected judgeArea: CardArea;

	protected processArea: CardArea;

	protected useCount: Map<string, number>;

	protected useLimit: Map<string, number>;

	protected requestTimeout: number;

	constructor(user: User) {
		super();
		this.user = user;

		this.handArea = new CardArea(CardAreaType.Hand, this);
		this.equipArea = new CardArea(CardAreaType.Equip, this);
		this.judgeArea = new CardArea(CardAreaType.Judge, this);
		this.processArea = new CardArea(CardAreaType.Process, this);

		this.useCount = new Map();
		this.useLimit = new Map();
		this.requestTimeout = 15000;
	}

	getUser(): User {
		return this.user;
	}

	getId(): number {
		return this.user ? this.user.getId() : 0;
	}

	getName(): string | undefined {
		return this.user ? this.user.getName() : undefined;
	}

	getRoom(): Room | null {
		return this.user ? this.user.getRoom() : null;
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

		let reply = [];
		try {
			reply = await this.user.request(cmd.ChooseGeneral, {
				sameKingdom: !!opt.sameKingdom,
				num: opt.num || 1,
				generals: generals.map((general, i) => ({
					id: i,
					kingdom: general.getKingdom(),
					name: general.getName(),
				})),
			}, opt.timeout ? opt.timeout * 1000 : this.requestTimeout * 2);
		} catch (error) {
			console.error(error);
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

	async askForCards(area: CardArea, options: AskForCardOptions): Promise<Card[]> {
		let reply = null;

		try {
			reply = await this.user.request(cmd.ChooseCards, {
				area: area.toJSON(),
				...options,
			}, this.requestTimeout);
		} catch (error) {
			// No response from client
		}

		const cardSet = new Set<Card>();
		if (reply instanceof Array) {
			for (const cardId of reply) {
				const card = area.find((c) => c.getId() === cardId);
				if (card) {
					cardSet.add(card);
				}
			}
		}

		const selected = Array.from(cardSet);
		if (options.num > 0) {
			let delta = options.num - selected.length;
			if (delta < 0) {
				selected.splice(options.num, -delta);
			} else if (delta > 0) {
				delta = Math.min(delta, area.size - selected.length);
				const cards = area.getCards().filter((card) => !selected.includes(card));
				selected.push(...cards.slice(0, delta));
			}
		}

		return selected;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async request(command: number, args: any, timeout: number): Promise<any> {
		if (!this.user) {
			return null;
		}

		return this.user.request(command, args, timeout === undefined ? this.requestTimeout : timeout);
	}

	updateProperty(prop: string, value: PropertyValue): void {
		this.user.send(cmd.UpdatePlayer, {
			uid: this.getId(),
			prop,
			value,
		});
	}

	broadcastProperty(prop: string, value: PropertyValue): void {
		const room = this.getRoom();
		if (!room) {
			return;
		}

		room.broadcast(cmd.UpdatePlayer, {
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

	clearUseLimit(): void {
		this.useLimit.clear();
	}

	async play(availableCards: Card[]): Promise<PlayAction | null> {
		let reply = null;
		try {
			reply = await this.user.request(cmd.Play, {
				cards: availableCards.map((card) => card.getId()),
			}, this.requestTimeout);
		} catch (error) {
			return null;
		}
		if (!reply) {
			return null;
		}

		if (!reply.skill) {
			const { cards } = reply;
			if (!cards) {
				return null;
			}

			const cardId = cards[0];
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
}

export default ServerPlayer;
