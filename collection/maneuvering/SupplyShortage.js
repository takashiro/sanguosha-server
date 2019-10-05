const DelayedTrickCard = require('../DelayedTrickCard');

class SupplyShortage extends DelayedTrickCard {
	constructor(suit, number) {
		super('supply-shortage', suit, number);
	}
}

module.exports = SupplyShortage;
