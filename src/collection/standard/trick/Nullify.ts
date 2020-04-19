import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from '../../FixedTargetTrickCard';

class Nullify extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('nullify', suit, number);
	}

	async isAvailable(): Promise<boolean> {
		return false;
	}
}

export default Nullify;
