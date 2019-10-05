const ArmorCard = require('../ArmorCard');

class VineArmor extends ArmorCard {
	constructor(suit, number) {
		super('vine-armor', suit, number);
	}
}

module.exports = VineArmor;
