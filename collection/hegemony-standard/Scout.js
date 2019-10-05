const TrickCard = require('../TrickCard');

class Scout extends TrickCard {
	constructor(suit, number) {
		super('scout', suit, number);
	}
}

module.exports = Scout;
