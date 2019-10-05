const TrickCard = require('../TrickCard');

class BarbarianInvasion extends TrickCard {
	constructor(suit, number) {
		super('barbarian-invasion', suit, number);
	}
}

module.exports = BarbarianInvasion;
