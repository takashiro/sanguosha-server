const ArmorCard = require('../ArmorCard');

class SilverLion extends ArmorCard {
	constructor(suit, number) {
		super('silver-lion', suit, number);
	}
}

module.exports = SilverLion;
