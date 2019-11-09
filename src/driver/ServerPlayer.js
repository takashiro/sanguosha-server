
const Player = require('../core/Player');
const CardArea = require('../core/CardArea');
const cmd = require('../cmd');

const CardUseStruct = require('./CardUseStruct');

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
		this.processArea = new CardArea(CardArea.Type.Process, this);

		this.useCount = new Map();
		this.useLimit = new Map();
		this.requestTimeout = 15000;
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

	setRequestTimeout(msecs) {
		this.requestTimeout = msecs;
	}

	getRequestTimeout() {
		return this.requestTimeout;
	}

	getDriver() {
		return this.user ? this.user.getDriver() : null;
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
			}, options.timeout ? options.timeout * 1000 : this.requestTimeout * 2);
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
			}, this.requestTimeout);
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

	request(command, args = null, timeout = null) {
		if (!this.user) {
			return null;
		}

		return this.user.request(command, args, timeout === null ? this.requestTimeout : timeout);
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

	async play() {
		const availableHandCards = this.handArea.findAll((card) => card.isAvailable(this));

		let reply = null;
		try {
			reply = await this.user.request(cmd.Play, {
				cards: availableHandCards.map((card) => card.getId()),
			}, this.requestTimeout);
		} catch (error) {
			return false;
		}
		if (!reply) {
			return false;
		}

		if (!reply.skill) {
			const { cards } = reply;
			const cardId = cards[0];
			if (!cardId || typeof cardId !== 'number') {
				return false;
			}

			const card = availableHandCards.find((c) => c.getId() === cardId);
			if (!card) {
				return false;
			}

			return this.playCard(card);
		}

		// TO-DO: Invoke a proactive skill.
		return false;
	}

	async playCard(card) {
		if (!card.isAvailable(this)) {
			return false;
		}

		const driver = this.getDriver();
		const players = driver.getPlayers();
		const targets = [];

		// Request to choose card targets
		const expiry = Date.now() + this.requestTimeout;
		while (Date.now() < expiry) {
			const candidates = players.map((player) => {
				const selectable = card.targetFilter(targets, player, this);
				return {
					seat: player.getSeat(),
					selectable,
				};
			});
			const feasible = card.targetFeasible(targets, this);

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

			if (reply.player) {
				const player = driver.findPlayer(reply.player);
				if (!player || !card.targetFilter(targets, player, this)) {
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
			} else if (reply.confirm) {
				break;
			} else {
				return false;
			}
		}

		// Confirm the targets are feasible
		if (!card.targetFeasible(targets, this)) {
			return false;
		}

		const use = new CardUseStruct(this, card);
		use.to = targets;
		driver.useCard(use);

		return true;
	}
}

module.exports = ServerPlayer;
