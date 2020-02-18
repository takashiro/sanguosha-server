import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Harvest extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('harvest', suit, number);
	}
}

export default Harvest;
