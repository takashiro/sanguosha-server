const TrickCard = require('../TrickCard');

class BorrowSword extends TrickCard {
	constructor(suit, number) {
		super('borrow-sword', suit, number);
	}
}
module.exports = BorrowSword;
