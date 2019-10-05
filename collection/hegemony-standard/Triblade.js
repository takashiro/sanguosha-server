const WeaponCard = require('../WeaponCard');

class Triblade extends WeaponCard {
	constructor(suit, number) {
		super('triblade', suit, number);
	}
}

module.exports = Triblade;
