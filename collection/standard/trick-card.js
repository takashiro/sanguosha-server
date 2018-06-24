
const TrickCard = require('../TrickCard');
const DelayedTrickCard = require('../DelayedTrickCard');

class Duel extends TrickCard {

	constructor(suit, number) {
		super('duel', suit, number);
	}

}

class Dismantle extends TrickCard {

	constructor(suit, number) {
		super('dismantle', suit, number);
	}

}

class Snatch extends TrickCard {

	constructor(suit, number) {
		super('snatch', suit, number);
	}

}

class BorrowSword extends TrickCard {

	constructor(suit, number) {
		super('borrow-sword', suit, number);
	}

}

class Nullification extends TrickCard {

	constructor(suit, number) {
		super('nullification', suit, number);
	}

}

class BarbarianInvasion extends TrickCard {

	constructor(suit, number) {
		super('barbarian-invasion', suit, number);
	}

}

class ArrowBarrage extends TrickCard {

	constructor(suit, number) {
		super('arrow-barrage', suit, number);
	}

}

class PeachGarden extends TrickCard {

	constructor(suit, number) {
		super('nullification', suit, number);
	}

}

class Harvest extends TrickCard {

	constructor(suit, number) {
		super('harvest', suit, number);
	}

}

class ExNihilo extends TrickCard {

	constructor(suit, number) {
		super('ex-nihilo', suit, number);
	}

}

class Indulgence extends DelayedTrickCard {

	constructor(suit, number) {
		super('indulgence', suit, number);
	}

}

class Lightning extends DelayedTrickCard {

	constructor(suit, number) {
		super('lightning', suit, number);
	}

}

module.exports = {
	Duel,
	Dismantle,
	Snatch,
	BorrowSword,
	Nullification,
	BarbarianInvasion,
	ArrowBarrage,
	PeachGarden,
	Harvest,
	ExNihilo,
	Indulgence,
	Lightning,
};
