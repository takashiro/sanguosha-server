
const assert = require('assert');

const cmd = require('../cmd');
const {BasicGameRule} = require('../mode/basic-rules');

describe('BasicGameRule', function () {
	const res = {};
	const driver = {
		room: {
			users: [
				{id: 1, name: 'user1'},
				{id: 2, name: 'user2'},
			],

			broadcast(command, args) {
				res.command = command;
				res.args = args;
			}
		},
		stop() {
			this.finished = true;
		},
		isRunning() {
			return !this.finished;
		},
		trigger() {},
	};

	const rule = new BasicGameRule;
	rule.idle = 0;

	it('prepares players', function () {
		rule.preparePlayers(driver);

		const players = driver.players;
		const users = driver.room.users;
		assert(players.length === users.length);
		for (let i = 0; i < players.length; i++) {
			assert(players[i].id === users[i].id);
			assert(players[i].name === users[i].name);
		}
	});

	it('prepares seats', function () {
		rule.prepareSeats(driver);
		assert(res.command === cmd.ArrangeSeats);
	});

	it('activates a player', async function () {
		const player = driver.players[0];
		const phases = [];
		player.setPhase = function (phase) {
			phases.push(phase);
		};
		await rule.activatePlayer(driver, player);
		delete player.setPhase;

		for (let i = 0; i < 6; i++) {
			assert(phases[i] === i + 1);
		}
		assert(phases[6] === 0);
	});

	it('proceeds the game', async function () {
		const phases = [];
		const setPhase = function (phase) {
			phases.push(phase);
			if (phases.length >= 14) {
				driver.stop();
			}
		};

		const players = driver.players;
		for (const player of players) {
			player.setPhase = setPhase;
		}

		await rule.proceed(driver);
		for (const player of players) {
			delete player.setPhase;
		}

		for (let i = 0; i < 6; i++) {
			assert(phases[i] === i + 1);
			assert(phases[7 + i] === i + 1);
		}
		assert(phases[6] === 0);
		assert(phases[13] === 0);
	});
});
