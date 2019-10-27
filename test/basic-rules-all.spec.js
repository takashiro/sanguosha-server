
const assert = require('assert');
const sinon = require('sinon');

const cmd = require('../src/cmd');
const GameEvent = require('../src/driver/GameEvent');

const BasicRule = require('../src/mode/basic/BasicRule');

const Phase = require('../src/core/Player/Phase');

describe('Basic Rule', function () {
	this.afterEach(function () {
		sinon.restore();
	});

	const users = [
		{ id: 1, name: 'user1' },
		{ id: 2, name: 'user2' },
	];

	const driver = {
		room: {
			broadcast: sinon.fake(),
		},
		getUsers() { return users; },
		stop() {
			this.finished = true;
		},
		isRunning() {
			return !this.finished;
		},
		trigger() {},
	};

	const rule = new BasicRule();
	rule.setDriver(driver);
	rule.idle = 0;

	it('binds to start event', function () {
		assert(rule.event === GameEvent.StartGame);
	});

	it('prepares players', function () {
		rule.preparePlayers();

		const { players } = driver;
		assert(players.length === users.length);
		for (let i = 0; i < players.length; i++) {
			assert(players[i].getId() === users[i].id);
			assert(players[i].getName() === users[i].name);
		}
	});

	it('prepares seats', function () {
		rule.prepareSeats();
		const players = driver.players.map((player) => ({
			uid: player.id,
			seat: player.getSeat(),
			name: player.name,
		}));
		sinon.assert.calledWith(driver.room.broadcast, cmd.ArrangeSeats, players);
	});

	it('activates a player', async function () {
		const player = driver.players[0];
		const phases = [];
		player.setPhase = function (phase) {
			phases.push(phase);
		};
		await rule.activatePlayer(player);
		delete player.setPhase;

		for (let i = 0; i < 6; i++) {
			assert(phases[i] === i + 1);
		}
		assert(phases[6] === 0);
	});

	it('proceeds the game', async function () {
		const { players } = driver;
		for (const player of players) {
			player.setPhase = sinon.spy();
		}

		driver.trigger = function (event, player, data) {
			if (player === players[1]) {
				if (event === GameEvent.StartPhase && data.to === Phase.Draw) {
					return true;
				}
				if (event === GameEvent.EndPhase && data.to === Phase.End) {
					this.stop();
					return true;
				}
			}
			return false;
		};

		await rule.proceed();

		const phases = [Phase.Start, Phase.Judge, Phase.Draw, Phase.Play, Phase.Discard, Phase.End, Phase.Inactive];
		assert.strictEqual(players[0].setPhase.callCount, 7);
		for (let i = 0; i < 7; i++) {
			assert(players[0].setPhase.getCall(i).calledWith(phases[i]));
		}

		phases.splice(2, 1);
		assert.strictEqual(players[1].setPhase.callCount, 6);
		for (let i = 0; i < 6; i++) {
			assert(players[1].setPhase.getCall(i).calledWith(phases[i]));
		}

		for (const player of players) {
			delete player.setPhase;
		}
		delete driver.trigger;
	});
});
