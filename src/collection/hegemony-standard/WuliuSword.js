const WeaponCard = require('../WeaponCard');

class WuliuSword extends WeaponCard {
	constructor(suit, number) {
		super('wuliu-sword', suit, number);
	}
}

module.exports = WuliuSword;
