const WeaponCard = require('../WeaponCard');

class Axe extends WeaponCard {
	constructor(suit, number) {
		super('axe', suit, number);
	}
}

module.exports = Axe;
