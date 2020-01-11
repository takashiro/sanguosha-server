const BasicCard = require('../BasicCard');

class Wine extends BasicCard {
	constructor(suit, number) {
		super('wine', suit, number);
	}
}

module.exports = Wine;
