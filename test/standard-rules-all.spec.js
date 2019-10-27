const assert = require('assert');
const sinon = require('sinon');

const GameDriver = require('../src/driver');
const GameEvent = require('../src/driver/GameEvent');

const StandardRule = require('../src/mode/standard/StandardRule');

const cmd = require('../src/cmd');
const Role = require('../src/core/Player/Role');

function countArray(arr, condition) {
	let count = 0;
	for (const a of arr) {
		if (condition(a)) {
			count++;
		}
	}
	return count;
}

describe('StandardRule', function () {
	const users = [];

	const driver = new GameDriver({
		broadcast() {},
		broadcastExcept() {},
		getUsers() { return users; },
	});

	const candidateDuplicates = [];

	function request(command, args) {
		if (command === cmd.ChooseGeneral) {
			candidateDuplicates.push(...args.generals.map((general) => general.name));
			return Math.floor(Math.random() * args.generals.length);
		}
		if (command === cmd.MoveCards) {
			console.log(args);
		}
		return null;
	}
	const send = sinon.fake();

	for (let i = 1; i <= 8; i++) {
		users.push({
			id: i,
			name: `user${i}`,
			send,
			request,
		});
	}

	const rule = new StandardRule();
	rule.setDriver(driver);

	it('binds to start event', function () {
		assert(rule.event === GameEvent.StartGame);
	});

	describe('#preparePlayers()', function () {
		it('prepares players', function () {
			rule.preparePlayers();
		});
	});

	describe('#prepareRules()', function () {
		it('prepares roles', function () {
			rule.prepareRoles();

			const { players } = driver;
			assert(players[0].getRole() === Role.Emperor);

			const rebelNum = countArray(players, (player) => player.getRole() === Role.Rebel);
			assert(rebelNum === 4);

			const emperorNum = countArray(players, (player) => player.getRole() === Role.Emperor);
			assert(emperorNum === 1);

			const renegadeNum = countArray(players, (player) => player.getRole() === Role.Renegade);
			assert(renegadeNum === 1);

			const loyalistNum = countArray(players, (player) => player.getRole() === Role.Loyalist);
			assert(loyalistNum === 2);
		});
	});

	describe('#prepareSeats()', function () {
		it('prepares seats', function () {
			rule.prepareSeats();

			const seats = [];
			for (const player of driver.players) {
				seats.push(player.getSeat());
				assert(player.getSeat() > 0);
			}

			seats.sort();
			for (let i = 0; i < seats.length; i++) {
				assert(seats[i] === i + 1);
			}
		});
	});

	describe('#prepareGenerals()', function () {
		it('prepares generals', async function () {
			await rule.prepareGenerals();
			for (const player of driver.players) {
				const general = player.getGeneral();
				assert(general);
			}
		});
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

	describe('#prepareCards()', function () {
		it('prepares cards', function () {
			rule.prepareCards();

			for (const player of driver.players) {
				assert(player.handArea.size === 4);
			}
		});
	});

	it('handles invalid values', async function () {
		driver.users = [];
		driver.players = [];
		await rule.prepareRoles();
		await rule.effect();
	});
});
