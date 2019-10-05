
const TrickCard = require('./TrickCard');

class DelayedTrickCard extends TrickCard {
	constructor(name, suit, number) {
		super(name, suit, number);
	}
}

module.exports = DelayedTrickCard;
