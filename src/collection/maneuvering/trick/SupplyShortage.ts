import { CardSuit as Suit } from '@karuta/sanguosha-core';

import DelayedTrickCard from '../../../base/DelayedTrickCard';

class SupplyShortage extends DelayedTrickCard {
	constructor(suit: Suit, number: number) {
		super('supply-shortage', suit, number);
	}
}

export default SupplyShortage;
