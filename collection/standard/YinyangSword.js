const WeaponCard = require('../WeaponCard');

class YinyangSword extends WeaponCard {
	constructor(suit, number) {
		super('yinyang-sword', suit, number);
	}
}

module.exports = YinyangSword;
