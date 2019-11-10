
const assert = require('assert');
const Card = require('../src/core/Card');

describe('Card', function () {
	const card = new Card('test', Card.Suit.Heart, 12);

	it('is virtual', function () {
		assert(!card.isReal());
	});

	it('is named test', function () {
		assert(card.getName() === 'test');
	});

	it('is of Heart', function () {
		assert(card.getSuit() === Card.Suit.Heart);
	});

	it('is numbered 12', function () {
		assert(card.getNumber() === 12);
	});

	it('is red', function () {
		assert(card.getColor() === Card.Color.Red);
	});

	it('is converted to JSON', function () {
		const data = card.toJSON();
		assert(data.id === 0);
		assert(data.name === 'test');
		assert(data.suit === Card.Suit.Heart);
		assert(data.number === 12);
	});
});
