const WeaponCard = require('../WeaponCard');

class Halberd extends WeaponCard {
	constructor(suit, number) {
		super('halberd', suit, number);
	}
}

module.exports = Halberd;
