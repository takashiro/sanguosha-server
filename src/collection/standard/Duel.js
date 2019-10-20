const TrickCard = require('../TrickCard');

class Duel extends TrickCard {
	constructor(suit, number) {
		super('duel', suit, number);
	}
}

module.exports = Duel;
