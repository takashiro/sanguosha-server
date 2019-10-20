const TrickCard = require('../TrickCard');

class ExNihilo extends TrickCard {
	constructor(suit, number) {
		super('ex-nihilo', suit, number);
	}
}

module.exports = ExNihilo;
