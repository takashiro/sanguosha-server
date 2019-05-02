
const assert = require('assert');
const {StandardGameStartRule} = require('../mode/standard-rules');

const Role = require('../core/Player/Role');

function countArray(arr, condition) {
	let count = 0;
	for (const a of arr) {
		if (condition(a)) {
			count++;
		}
	}
	return count;
}

describe('Standard Mode - GameStartRule', function () {
	const driver = {
		room: {
			broadcast() {},
			users: [],
		},
	};
	for (let i = 1; i <= 8; i++) {
		driver.room.users.push({id: i, name: 'user' + i});
	}

	const rule = new StandardGameStartRule;

	it('prepares players', function () {
		rule.preparePlayers(driver);
	});

	it('prepares roles', function () {
		rule.prepareRoles(driver);

		const players = driver.players;
		assert(players[0].role() === Role.Emperor);

		const rebelNum = countArray(players, player => player.role() === Role.Rebel);
		assert(rebelNum === 4);

		const emperorNum = countArray(players, player => player.role() === Role.Emperor);
		assert(emperorNum === 1);

		const renegadeNum = countArray(players, player => player.role() === Role.Renegade);
		assert(renegadeNum === 1);

		const loyalistNum = countArray(players, player => player.role() === Role.Loyalist);
		assert(loyalistNum === 2);
	});

	it('prepares seats', function () {
		rule.prepareSeats(driver);
	});
});
