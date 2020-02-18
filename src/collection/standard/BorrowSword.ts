import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class BorrowSword extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('borrow-sword', suit, number);
	}
}

export default BorrowSword;
