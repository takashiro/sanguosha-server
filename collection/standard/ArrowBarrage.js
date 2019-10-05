const TrickCard = require('../TrickCard');

class ArrowBarrage extends TrickCard {
	constructor(suit, number) {
		super('arrow-barrage', suit, number);
	}
}

module.exports = ArrowBarrage;
