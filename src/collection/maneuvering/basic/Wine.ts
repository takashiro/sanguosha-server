import { CardSuit as Suit } from '@karuta/sanguosha-core';

import BasicCard from '../../BasicCard';

class Wine extends BasicCard {
	constructor(suit: Suit, number: number) {
		super('wine', suit, number);
	}
}

export default Wine;
