const TrickCard = require('../TrickCard');

class Ally extends TrickCard {
	constructor(suit, number) {
		super('ally', suit, number);
	}
}

module.exports = Ally;
