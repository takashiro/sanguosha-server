const TrickCard = require('../TrickCard');

class Nullification extends TrickCard {
	constructor(suit, number) {
		super('nullification', suit, number);
	}
}

module.exports = Nullification;
