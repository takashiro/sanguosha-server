
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
	}

	get id() {
		return this.user ? this.user.id : 0;
	}

	async askForGeneral(generals, options = {}) {
		options = {
			...CHOOSE_GENERAL_DEFAULT_OPTIONS,
			...options
		};

		let reply = [];
		try {
			reply = await this.user.request(cmd.ChooseGeneral, {
				sameKingdom: !!options.sameKingdom,
				num: options.num || 1,
				generals: generals.map((general, i) => ({
					id: i,
					kingdom: general.kingdom(),
					name: general.name(),
				}))
			}, options.timeout * 1000);
		} catch (error) {
			console.error(error);
		}

		let chosenGenerals = [];
		if (reply && reply instanceof Array) {
			for (let id of reply) {
				if (id >= 0 && id < generals.length) {
					chosenGenerals.push(generals[id]);
				}
			}
		}

		if (options.forced && chosenGenerals.length < options.num && generals.length >= options.num) {
			let availableGenerals = generals;
			if (options.sameKingdom && options.num > 1) {
				let kingdoms = new Map;
				for (let general of generals) {
					let alliances = kingdoms.get(general.kingdom());
					if (!alliances) {
						kingdoms.set(general.kingdom(), [general]);
					} else {
						alliances.push(general);
					}
				}

				let availableKingdoms = [];
				for (let [_, alliances] of kingdoms) {
					if (alliances.length >= options.num) {
						availableKingdoms.push(alliances);
					}
				}

				let index = Math.floor(Math.random() * availableKingdoms.length);
				availableGenerals = availableKingdoms[index];
			}

			do {
				let index = Math.floor(Math.random() * availableGenerals.length);
				let chosen = availableGenerals[index];
				if (chosenGenerals.indexOf(chosen) < 0) {
					chosenGenerals.push(chosen);
				}
			} while (chosenGenerals.length < options.num);
		}

		return chosenGenerals;
	}

	updateProperty(prop, value) {
		this.user.send(cmd.UpdatePlayer, {
			uid: this.user.id,
			prop,
			value
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
			value
		});
	}

}

module.exports = ServerPlayer;
