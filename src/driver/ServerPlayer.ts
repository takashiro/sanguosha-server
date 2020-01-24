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
				const cards = area.cards.filter((card) => !selected.includes(card));
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

	/*
	async play() {
		const availableCards = [];
		for (const card of this.handArea.getCards()) {
			if (await card.isAvailable(this)) {
				availableCards.push(card);
			}
		}

		let reply = null;
		try {
			reply = await this.user.request(cmd.Play, {
				cards: availableCards.map((card) => card.getId()),
			}, this.requestTimeout);
		} catch (error) {
			return false;
		}
		if (!reply) {
			return false;
		}

		if (!reply.skill) {
			const { cards } = reply;
			if (!cards) {
				return false;
			}

			const cardId = cards[0];
			if (!cardId || typeof cardId !== 'number') {
				return false;
			}

			const card = availableCards.find((c) => c.getId() === cardId);
			if (!card) {
				return false;
			}

			return this.playCard(card);
		}

		// TO-DO: Invoke a proactive skill.
		return false;
	}

	async playCard(card) {
		if (!await card.isAvailable(this)) {
			return false;
		}

		const driver = this.getDriver();
		const players = driver.getPlayers();
		const targets = [];

		// Request to choose card targets
		const expiry = Date.now() + this.requestTimeout;
		while (Date.now() < expiry) {
			const candidates = [];
			for (const player of players) {
				if (await card.targetFilter(targets, player, this)) {
					candidates.push(player.getSeat());
				}
			}
			const feasible = await card.targetFeasible(targets, this);

			let reply = null;
			try {
				reply = await this.request(cmd.ChoosePlayer, {
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

			const player = driver.findPlayer(reply.player);
			if (!player || !await card.targetFilter(targets, player, this)) {
				// Ends play phase
				return false;
			}

			const i = targets.indexOf(player);
			if (reply.selected) {
				if (i < 0) {
					targets.push(player);
				}
			} else if (i >= 0) {
				targets.splice(i, 1);
			}
		}

		// Confirm the targets are feasible
		if (!await card.targetFeasible(targets, this)) {
			return false;
		}

		const use = new CardUseStruct(this, card);
		use.to = targets;
		await driver.useCard(use);

		return true;
	}
	*/
}

export default ServerPlayer;
