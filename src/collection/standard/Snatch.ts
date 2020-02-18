import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Snatch extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('snatch', suit, number);
	}
}

export default Snatch;
