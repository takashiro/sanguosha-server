import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class ExNihilo extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('ex-nihilo', suit, number);
	}
}

export default ExNihilo;
