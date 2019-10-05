const ArmorCard = require('../ArmorCard');

class EightDiagram extends ArmorCard {
	constructor(suit, number) {
		super('eight-diagram', suit, number);
	}
}

module.exports = EightDiagram;
