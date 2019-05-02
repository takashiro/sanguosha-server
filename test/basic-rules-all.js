
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
		trigger() {},
	};

	const rule = new BasicGameRule;

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
});
