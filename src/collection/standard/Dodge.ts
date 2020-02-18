import { CardSuit as Suit } from '@karuta/sanguosha-core';

import BasicCard from '../BasicCard';

class Dodge extends BasicCard {
	constructor(suit: Suit, number: number) {
		super('dodge', suit, number);
	}
}

export default Dodge;
