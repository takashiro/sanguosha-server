const BasicCard = require('../BasicCard');

class Dodge extends BasicCard {
	constructor(suit, number) {
		super('dodge', suit, number);
	}
}

module.exports = Dodge;
