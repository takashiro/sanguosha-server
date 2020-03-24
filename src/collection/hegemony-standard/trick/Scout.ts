import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../../TrickCard';

class Scout extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('scout', suit, number);
	}
}

export default Scout;
