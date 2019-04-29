
const Player = require('../core/Player');
const CardArea = require('../core/CardArea');
const cmd = require('../cmd');

class ServerPlayer extends Player {

	constructor(user) {
		super();
		this.user = user;

		this.handArea = new CardArea(CardArea.Type.Hand, this);
		this.equipArea = new CardArea(CardArea.Type.Equip, this);
		this.delayedTrickArea = new CardArea(CardArea.Type.DelayedTrick, this);
		this.judgeArea = new CardArea(CardArea.Type.Judge, this);
	}

	async askForGeneral(generals, options = {}) {
		options = Object.assign({
			timeout: 40,
			num: 1,
			sameKingdom: false,
			forced: true,
		}, options);

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

		let chosen_generals = [];
		if (reply && reply instanceof Array) {
			for (let id of reply) {
				if (id >= 0 && id < generals.length) {
					chosen_generals.push(generals[id]);
				}
			}
		}

		if (options.forced && chosen_generals.length < options.num && generals.length >= options.num) {
			let available_generals = generals;
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

				let available_kingdoms = [];
				for (let [_, alliances] of kingdoms) {
					if (alliances.length >= options.num) {
						available_kingdoms.push(alliances);
					}
				}

				let index = Math.floor(Math.random() * available_kingdoms.length);
				available_generals = available_kingdoms[index];
			}

			do {
				let index = Math.floor(Math.random() * available_generals.length);
				let chosen = available_generals[index];
				if (chosen_generals.indexOf(chosen) < 0
					&& chosen_generals.every) {
					chosen_generals.push(chosen);
				}
			} while (chosen_generals.length < options.num);
		}

		return chosen_generals;
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
