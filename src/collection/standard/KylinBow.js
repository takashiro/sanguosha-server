const WeaponCard = require('../WeaponCard');

class KylinBow extends WeaponCard {
	constructor(suit, number) {
		super('kylin-bow', suit, number);
	}
}

module.exports = KylinBow;
