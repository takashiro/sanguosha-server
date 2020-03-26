import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from '../../FixedTargetTrickCard';

class Nullification extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('nullification', suit, number);
	}

	async isAvailable(): Promise<boolean> {
		return false;
	}
}

export default Nullification;
