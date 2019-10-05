const TrickCard = require('../TrickCard');

class Dismantle extends TrickCard {
	constructor(suit, number) {
		super('dismantle', suit, number);
	}
}

module.exports = Dismantle;
