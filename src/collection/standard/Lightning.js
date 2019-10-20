const DelayedTrickCard = require('../DelayedTrickCard');

class Lightning extends DelayedTrickCard {
	constructor(suit, number) {
		super('lightning', suit, number);
	}
}

module.exports = Lightning;
