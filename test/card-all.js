
const assert = require('assert');
const Card = require('../core/Card');

describe('Card', function () {
	const card = new Card('test', Card.Suit.Heart, 12);

	it('is virtual', function () {
		assert(card.isVirtual());
	});

	it('is named test', function () {
		assert(card.name() === 'test');
	});

	it('is of Heart', function () {
		assert(card.suit() === Card.Suit.Heart);
	});

	it('is numbered 12', function () {
		assert(card.number() === 12);
	});

	it('is red', function () {
		assert(card.color() === Card.Color.Red);
	});

	it('is converted to JSON', function () {
		const data = card.toJSON();
		assert(data.id === 0);
		assert(data.name === 'test');
		assert(data.suit === Card.Suit.Heart);
		assert(data.number === 12);
	});
});
