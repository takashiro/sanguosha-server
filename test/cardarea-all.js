
const assert = require('assert');
const CardArea = require('../core/CardArea');

describe('CardArea', function () {
	const area = new CardArea(CardArea.Type.DrawPile);

	it('is a draw pile', function () {
		assert(area.type === CardArea.Type.DrawPile);
	});

	it('is empty', function () {
		assert(area.size === 0);
	});

	it('adds a card', function () {
		area.add(1);
		assert(area.size === 1);
	});

	it('adds a card', function () {
		area.add(3, CardArea.Direction.Bottom);
		assert(area.size === 2);
	});

	it('prepends a card', function () {
		area.add(2, CardArea.Direction.Top);
		assert(area.size === 3);
	});


	it('checkes last card', function () {
		assert(area.last() === 3);
	});

	it('takes last card', function () {
		assert(area.takeLast() === 3);
		assert(area.size === 2);
	});

	it('checks first card', function () {
		assert(area.first() === 2);
	});

	it('takes first card', function () {
		assert(area.takeFirst() === 2);
		assert(area.size === 1);
	});

	it('has some card', function () {
		assert(area.has(1));
		assert(!area.has(2));
		assert(!area.has(3));
	});

	it('finds a card', function () {
		assert(area.find(card => card <= 3) === 1);
	});

	it('removes a card', function () {
		area.add(1000);
		assert(area.has(1000));
		area.remove(1000);
		assert(!area.has(1000));
	});

	it('takes a random card', function () {
		assert(area.rand() === 1);
		assert(area.size === 1);
	});

	it('clear all cards', function () {
		area.add(2000);
		assert(area.size > 1);
		area.clear();
		assert(area.size === 0);
		assert(!area.has(1));
	});
});
