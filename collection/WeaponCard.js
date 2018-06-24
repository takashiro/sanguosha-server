
const EquipCard = require('./EquipCard');

class WeaponCard extends EquipCard {

	constructor(name, suit, number) {
		super(name, suit, number);
	}

}

module.exports = WeaponCard;
