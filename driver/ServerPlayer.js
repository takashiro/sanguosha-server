
const Player = require('../core/Player');
const CardArea = require('../core/CardArea');
const cmd = require('../cmd');

const CHOOSE_GENERAL_DEFAULT_OPTIONS = {
	timeout: 40,
	num: 1,
	sameKingdom: false,
	forced: true,
};

class ServerPlayer extends Player {
	constructor(user) {
		super();
		this.user = user;

		this.handArea = new CardArea(CardArea.Type.Hand, this);
		this.equipArea = new CardArea(CardArea.Type.Equip, this);
		this.delayedTrickArea = new CardArea(CardArea.Type.DelayedTrick, this);
		this.judgeArea = new CardArea(CardArea.Type.Judge, this);

		this.useCount = new Map();
		this.useLimit = new Map();
	}

	get id() {
		return this.user ? this.user.id : 0;
	}

	getId() {
		return this.id;
	}

	get name() {
		return this.user ? this.user.name : '';
	}

	getName() {
		return this.name;
	}

	async askForGeneral(generals, options = {}) {
		options = {
			...CHOOSE_GENERAL_DEFAULT_OPTIONS,
			...options,
		};

		let reply = [];
		try {
			reply = await this.user.request(cmd.ChooseGeneral, {
				sameKingdom: !!options.sameKingdom,
				num: options.num || 1,
				generals: generals.map((general, i) => ({
					id: i,
					kingdom: general.getKingdom(),
					name: general.getName(),
				})),
			}, options.timeout * 1000);
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

		if (options.forced && chosenGenerals.length < options.num && generals.length >= options.num) {
			let availableGenerals = generals;
			if (options.sameKingdom && options.num > 1) {
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
					if (alliances.length >= options.num) {
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
			} while (chosenGenerals.length < options.num);
		}

		return chosenGenerals;
	}

	async askForCards(area, options) {
		let reply = null;

		try {
			reply = await this.user.request(cmd.ChooseCards, {
				area: area.toJSON(),
				...options,
			}, 15000);
		} catch (error) {
			// No response from client
		}

		const cardSet = new Set();
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
				cardSet.splice(options.num, -delta);
			} else if (delta > 0) {
				delta = Math.min(delta, area.size - selected.length);
				const cards = area.cards.filter((card) => !selected.includes(card));
				selected.push(...cards.slice(0, delta));
			}
		}

		return selected;
	}

	updateProperty(prop, value) {
		this.user.send(cmd.UpdatePlayer, {
			uid: this.user.id,
			prop,
			value,
		});
	}

	broadcastProperty(prop, value) {
		const room = this.user && this.user.room;
		if (!room) {
			return;
		}
		room.broadcast(cmd.UpdatePlayer, {
			uid: this.user.id,
			prop,
			value,
		});
	}

	addUseCount(name, delta) {
		const count = this.getUseCount(name);
		this.useCount.set(name, count + delta);
	}

	getUseCount(name) {
		return this.useCount.get(name) || 0;
	}

	resetUseCount(name) {
		this.useCount.set(name, 0);
	}

	clearUseCount() {
		this.useCount.clear();
	}

	getUseLimit(name) {
		return this.useLimit.get(name) || Infinity;
	}

	setUseLimit(name, limit) {
		this.useLimit.set(name, limit);
	}

	clearUseLimit() {
		this.useLimit.clear();
	}
}

module.exports = ServerPlayer;
