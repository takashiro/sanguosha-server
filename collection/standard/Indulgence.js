const DelayedTrickCard = require('../DelayedTrickCard');

class Indulgence extends DelayedTrickCard {
	constructor(suit, number) {
		super('indulgence', suit, number);
	}
}

module.exports = Indulgence;
