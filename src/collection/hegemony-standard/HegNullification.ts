import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class HegNullification extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('heg-nullification', suit, number);
	}
}

export default HegNullification;
