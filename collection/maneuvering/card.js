
const {Strike} = require('../standard/basic-card');
const BasicCard = require('../BasicCard');
const TrickCard = require('../TrickCard');
const DelayedTrickCard = require('../DelayedTrickCard');
const WeaponCard = require('../WeaponCard');
const ArmorCard = require('../ArmorCard');

class FireStrike extends Strike {

	constructor(suit, number) {
		super(suit, number);
		this._name = 'fire-strike';
	}

}

class ThunderStrike extends Strike {

	constructor(suit, number) {
		super(suit, number);
		this._name = 'thunder-strike';
	}

}

class Wine extends BasicCard {

	constructor(suit, number) {
		super('wine', suit, number);
	}

}

class SupplyShortage extends DelayedTrickCard {

	constructor(suit, number) {
		super('supply-shortage', suit, number);
	}

}

class FireAttack extends TrickCard {

	constructor(suit, number) {
		super('fire-attack', suit, number);
	}

}

class IronChain extends TrickCard {

	constructor(suit, number) {
		super('iron-chain', suit, number);
	}

}

class GudingBlade extends WeaponCard {

	constructor(suit, number) {
		super('guding-blade', suit, number);
	}

}

class PheonixFan extends WeaponCard {

	constructor(suit, number) {
		super('pheonix-fan', suit, number);
	}

}

class SilverLion extends ArmorCard {

	constructor(suit, number) {
		super('silver-lion', suit, number);
	}

}

class VineArmor extends ArmorCard {

	constructor(suit, number) {
		super('vine-armor', suit, number);
	}

}

module.exports = {
	FireStrike,
	ThunderStrike,
	Wine,

	SupplyShortage,
	FireAttack,
	IronChain,

	GudingBlade,
	PheonixFan,

	SilverLion,
	VineArmor,
};
