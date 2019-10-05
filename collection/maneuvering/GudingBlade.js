const WeaponCard = require('../WeaponCard');

class GudingBlade extends WeaponCard {
	constructor(suit, number) {
		super('guding-blade', suit, number);
	}
}

module.exports = GudingBlade;
