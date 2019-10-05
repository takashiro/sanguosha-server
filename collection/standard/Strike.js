const BasicCard = require('../BasicCard');

class Strike extends BasicCard {
	constructor(suit, number) {
		super('strike', suit, number);
	}
}

module.exports = Strike;
