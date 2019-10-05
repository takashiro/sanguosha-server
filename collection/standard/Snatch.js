const TrickCard = require('../TrickCard');

class Snatch extends TrickCard {
	constructor(suit, number) {
		super('snatch', suit, number);
	}
}

module.exports = Snatch;
