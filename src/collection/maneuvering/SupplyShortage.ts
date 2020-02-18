import { CardSuit as Suit } from '@karuta/sanguosha-core';

import DelayedTrickCard from '../DelayedTrickCard';

class SupplyShortage extends DelayedTrickCard {
	constructor(suit: Suit, number: number) {
		super('supply-shortage', suit, number);
	}
}

export default SupplyShortage;
