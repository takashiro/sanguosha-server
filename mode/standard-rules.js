
const {GameStartRule} = require('./basic-rules');

const cmd = require('../cmd');
const Role = require('../core/Player/Role');
const shuffle = require('../util/shuffle');
const randsub = require('../util/randsub');

function fillArray(arr, value, n) {
	for (let i = 0; i < n; i++) {
		arr.push(value);
	}
}

class StandardGameStartRule extends GameStartRule {

	constructor() {
		super();

		this.candidateGeneralNum = 3;
	}

	async effect(driver) {
		await this.preparePlayers(driver);
		await this.prepareRoles(driver);
		await this.prepareSeats(driver);
		await this.prepareGenerals(driver);
	}

	prepareRoles(driver) {
		const players = driver.players;
		if (!players || players.length <= 1) {
			return;
		}
		shuffle(players);

		let rebelNum = Math.floor(players.length / 2);
		let loyalistNum = players.length - rebelNum - 1;
		let renegadeNum = 0;
		if (loyalistNum > 1) {
			renegadeNum++;
			loyalistNum--;
		}

		const roles = [];
		fillArray(roles, Role.Rebel, rebelNum);
		fillArray(roles, Role.Loyalist, loyalistNum);
		fillArray(roles, Role.Renegade, renegadeNum);
		shuffle(roles);
		roles.unshift(Role.Emperor);

		for (let i = 0; i < roles.length; i++) {
			players[i].setRole(roles[i]);
		}
	}

	async prepareGenerals(driver) {
		driver.loadCollection('standard');
		const generals = driver.createGenerals();

		// Set up the Emperor first
		const players = driver.players;
		const emperor = players.find(player => player.role() === Role.Emperor);
		await this.prepareEmperor(emperor, generals);
		const emperorGeneral = emperor.general();
		emperor.broadcastProperty('general', emperorGeneral.toJSON());

		// Remove the Emperor's general from the candidate list
		for (let i = 0; i < generals.length; i++) {
			if (generals[i] === emperorGeneral) {
				generals.splice(i, 1);
				break;
			}
		}

		// Shuffle and set up others' generals
		shuffle(generals);
		const others = players.filter(player => player.role() !== Role.Emperor);
		await Promise.all(others.map(player => this.prepareGeneral(player, generals)));
		for (const player of others) {
			player.broadcastProperty('general', player.general().toJSON());
		}
	}

	async prepareEmperor(player, generals) {
		const candidates = generals.filter(general => general.isEmperor());

		const others = generals.filter(general => !general.isEmperor());
		candidates.push(...randsub(others, 2));

		const res = await player.askForGeneral(candidates, {num: 1});
		player.setGeneral(res[0]);
	}

	async prepareGeneral(player, generals) {
		const offset = this.candidateGeneralNum * (player.seat - 2);
		const candidates = generals.slice(offset, offset + this.candidateGeneralNum);
		const res = await player.askForGeneral(candidates, {num: 1});
		player.setGeneral(res[0]);
	}

}

module.exports = {
	StandardGameStartRule,
};
