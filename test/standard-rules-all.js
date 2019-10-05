
const assert = require('assert');
const GameDriver = require('../driver');
const GameEvent = require('../driver/GameEvent');

const StandardRule = require('../mode/standard/StandardRule');

const cmd = require('../cmd');
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
	const users = [];

	const driver = new GameDriver({
		broadcast() {},
		broadcastExcept() {},
		getUsers() { return users; },
	});

	const candidateDuplicates = [];

	class User {
		constructor(i) {
			this.id = i;
			this.name = `user${i}`;
		}

		send(command, args) {
		}

		request(command, args) {
			if (command === cmd.ChooseGeneral) {
				candidateDuplicates.push(...args.generals.map((general) => general.name));
				return Math.floor(Math.random() * args.generals.length);
			}
			if (command === cmd.MoveCards) {
				console.log(args);
			}
		}
	}
	for (let i = 1; i <= 8; i++) {
		users.push(new User(i));
	}

	const rule = new StandardRule();

	it('binds to start event', function () {
		assert(rule.event === GameEvent.StartGame);
	});

	it('prepares players', function () {
		rule.preparePlayers(driver);
	});

	it('prepares roles', function () {
		rule.prepareRoles(driver);

		const { players } = driver;
		assert(players[0].role() === Role.Emperor);

		const rebelNum = countArray(players, (player) => player.role() === Role.Rebel);
		assert(rebelNum === 4);

		const emperorNum = countArray(players, (player) => player.role() === Role.Emperor);
		assert(emperorNum === 1);

		const renegadeNum = countArray(players, (player) => player.role() === Role.Renegade);
		assert(renegadeNum === 1);

		const loyalistNum = countArray(players, (player) => player.role() === Role.Loyalist);
		assert(loyalistNum === 2);
	});

	it('prepares seats', function () {
		rule.prepareSeats(driver);

		const seats = [];
		for (const player of driver.players) {
			seats.push(player.seat());
			assert(player.seat() > 0);
		}

		seats.sort();
		for (let i = 0; i < seats.length; i++) {
			assert(seats[i] === i + 1);
		}
	});

	it('prepares generals', async function () {
		await rule.prepareGenerals(driver);
		for (const player of driver.players) {
			const general = player.general();
			assert(general);
		}
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

	it('prepares cards', async function () {
		await rule.prepareCards(driver);

		for (const player of driver.players) {
			assert(player.handArea.size === 4);
		}
	});
});
