
const assert = require('assert');

const cmd = require('../cmd');
const {GameStartRule} = require('../mode/basic-rules');

describe('GameStartRule', function () {
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
		}
	};

	const rule = new GameStartRule;

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
});
