import { CardSuit as Suit } from '@karuta/sanguosha-core';

import ArmorCard from '../../../base/ArmorCard';

class SilverLion extends ArmorCard {
	constructor(suit: Suit, number: number) {
		super('silver-lion', suit, number);
	}
}

export default SilverLion;
