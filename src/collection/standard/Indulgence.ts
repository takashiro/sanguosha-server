import { CardSuit as Suit } from '@karuta/sanguosha-core';

import DelayedTrickCard from '../DelayedTrickCard';

class Indulgence extends DelayedTrickCard {
	constructor(suit: Suit, number: number) {
		super('indulgence', suit, number);
	}
}

export default Indulgence;
