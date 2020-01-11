const BasicCard = require('../BasicCard');

class Peach extends BasicCard {
	constructor(suit, number) {
		super('peach', suit, number);
	}
}

module.exports = Peach;
