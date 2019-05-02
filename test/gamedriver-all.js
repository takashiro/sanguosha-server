
const assert = require('assert');
const GameDriver = require('../driver');

describe('GameDriver', function () {
	const driver = new GameDriver;

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
		assert(cards.every(card => card.id() > 0));
	});
});
