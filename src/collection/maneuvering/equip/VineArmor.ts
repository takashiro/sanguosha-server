import { CardSuit as Suit } from '@karuta/sanguosha-core';

import ArmorCard from '../../ArmorCard';

class VineArmor extends ArmorCard {
	constructor(suit: Suit, number: number) {
		super('vine-armor', suit, number);
	}
}

export default VineArmor;
