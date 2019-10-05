const TrickCard = require('../TrickCard');

class FireAttack extends TrickCard {
	constructor(suit, number) {
		super('fire-attack', suit, number);
	}
}

module.exports = FireAttack;
