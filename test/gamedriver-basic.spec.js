
const assert = require('assert');
const sinon = require('sinon');

const GameDriver = require('../src/driver');
const GameEvent = require('../src/driver/GameEvent');

describe('GameDriver', function () {
	this.afterEach(function () {
		sinon.restore();
	});

	const room = {
		broadcast: sinon.fake(),
	};
	const driver = new GameDriver(room);

	it('loads the standard collection', function () {
		driver.loadCollection('standard');
		assert(driver.collections.length === 1);

		const col = driver.collections[0];
		const generals = col.createGenerals();
		assert(generals.length === 25);
	});

	it('creates generals', function () {
		const generals = driver.createGenerals();
		assert(generals.length === 25);
	});

	it('creates cards', function () {
		const cards = driver.createCards();
		assert(cards.length > 0);
		assert(cards.every((card) => card.getId() > 0));
	});

	it('finds a player', function () {
		driver.players = [
			{ getSeat() { return 2; } },
			{ getSeat() { return 1; } },
		];
		assert.strictEqual(driver.getPlayers(), driver.players);
		assert.strictEqual(driver.findPlayer(2), driver.players[0]);
	});

	it('starts game', async function () {
		await driver.start();
		sinon.assert.calledWith(room.broadcast, GameEvent.StartGame);
	});

	describe('#getDistance()', function () {
		const players = [
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 1; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 2; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 3; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 4; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 5; } },
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 6; } },
		];

		it('refuses dead players', async function () {
			driver.players = players;
			assert(!Number.isFinite(await driver.getDistance(players[0], players[1])));
			assert(!Number.isFinite(await driver.getDistance(players[1], players[5])));
			assert(!Number.isFinite(driver.getDistance(players[0], players[5])));
		});

		it('calculates shorter distance', async function () {
			driver.players = players;
			const dist = await driver.getDistance(players[2], players[4]);
			assert.strictEqual(dist, 2);
		});

		it('calculates shorter distance', async function () {
			driver.players = players;
			const dist = await driver.getDistance(players[1], players[4]);
			assert.strictEqual(dist, 1);
		});
	});
});
