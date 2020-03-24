import { CardSuit as Suit } from '@karuta/sanguosha-core';

import DelayedTrickCard from '../../DelayedTrickCard';

class Lightning extends DelayedTrickCard {
	constructor(suit: Suit, number: number) {
		super('lightning', suit, number);
	}
}

export default Lightning;
