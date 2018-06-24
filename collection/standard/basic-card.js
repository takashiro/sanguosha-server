
const BasicCard = require('../BasicCard');

class Strike extends BasicCard {

	constructor(suit, number) {
		super('strike', suit, number);
	}

}

class Dodge extends BasicCard {

	constructor(suit, number) {
		super('dodge', suit, number);
	}

}

class Peach extends BasicCard {

	constructor(suit, number) {
		super('peach', suit, number);
	}

}

module.exports = {
	Strike,
	Dodge,
	Peach,
};
