
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
});
