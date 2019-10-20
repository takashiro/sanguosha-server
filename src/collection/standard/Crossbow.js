const WeaponCard = require('../WeaponCard');

class Crossbow extends WeaponCard {
	constructor(suit, number) {
		super('crossbow', suit, number);
	}
}

module.exports = Crossbow;
