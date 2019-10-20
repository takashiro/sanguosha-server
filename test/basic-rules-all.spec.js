
const assert = require('assert');
const sinon = require('sinon');

const cmd = require('../src/cmd');
const GameEvent = require('../src/driver/GameEvent');

const BasicRule = require('../src/mode/basic/BasicRule');
const PhaseRule = require('../src/mode/basic/PhaseRule');

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
	rule.idle = 0;

	it('binds to start event', function () {
		assert(rule.event === GameEvent.StartGame);
	});

	it('prepares players', function () {
		rule.preparePlayers(driver);

		const { players } = driver;
		assert(players.length === users.length);
		for (let i = 0; i < players.length; i++) {
			assert(players[i].getId() === users[i].id);
			assert(players[i].getName() === users[i].name);
		}
	});

	it('prepares seats', function () {
		rule.prepareSeats(driver);
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

		const { players } = driver;
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

describe('Phase Rule', function () {
	const rule = new PhaseRule();

	it('draws 2 cards', async function () {
		const player = {};

		const driver = {
			trigger() {},
			drawCards(target, num) {
				assert(target === player);
				assert(num === 2);
			},
		};

		await rule.effect(driver, player, {
			to: Phase.Draw,
		});
	});
});
