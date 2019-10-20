const WeaponCard = require('../WeaponCard');

class FrostSword extends WeaponCard {
	constructor(suit, number) {
		super('frost-sword', suit, number);
	}
}

module.exports = FrostSword;
