import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Nullification extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('nullification', suit, number);
	}
}

export default Nullification;
