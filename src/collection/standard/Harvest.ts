const TrickCard = require('../TrickCard');

class Harvest extends TrickCard {
	constructor(suit, number) {
		super('harvest', suit, number);
	}
}

module.exports = Harvest;
