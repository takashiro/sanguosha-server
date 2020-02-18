import { CardSuit as Suit } from '@karuta/sanguosha-core';

import BasicCard from '../BasicCard';

class Peach extends BasicCard {
	constructor(suit: Suit, number: number) {
		super('peach', suit, number);
	}
}

export default Peach;
