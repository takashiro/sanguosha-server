const TrickCard = require('../TrickCard');

class IronChain extends TrickCard {
	constructor(suit, number) {
		super('iron-chain', suit, number);
	}
}

module.exports = IronChain;
