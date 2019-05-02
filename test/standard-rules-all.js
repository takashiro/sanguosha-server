
const assert = require('assert');
const GameDriver = require('../driver');
const {StandardGameStartRule} = require('../mode/standard-rules');

const Role = require('../core/Player/Role');
const randsub = require('../util/randsub');

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
	const driver = new GameDriver({
		broadcast() {},
		users: [],
	});

	const candidateDuplicates = [];

	class User {

		constructor(i) {
			this.id = i;
			this.name = 'user' + i;
		}

		request(command, options) {
			candidateDuplicates.push(...options.generals.map(general => general.name));
			return Math.floor(Math.random() * options.generals.length);
		}

	}
	for (let i = 1; i <= 8; i++) {
		driver.room.users.push(new User(i));
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

	it('prepares generals', async function () {
		await rule.prepareGenerals(driver);
	});

	it('checks candidate duplicates', function () {
		candidateDuplicates.splice(0, 5);
		for (let i = 0; i < candidateDuplicates.length; i++) {
			const name = candidateDuplicates[i];
			for (let j = i + 1; j < candidateDuplicates.length; j++) {
				assert(candidateDuplicates[j] !== name);
			}
		}
	});
});
