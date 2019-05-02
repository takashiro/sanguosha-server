
const {GameStartRule} = require('./basic-rules');

const Role = require('../core/Player/Role');
const shuffle = require('../util/shuffle');

function fillArray(arr, value, n) {
	for (let i = 0; i < n; i++) {
		arr.push(value);
	}
}

class StandardGameStartRule extends GameStartRule {

	async effect(driver) {
		await this.preparePlayers(driver);
		await this.prepareRoles(driver);
		await this.prepareSeats(driver);
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

}

module.exports = {
	StandardGameStartRule,
};
