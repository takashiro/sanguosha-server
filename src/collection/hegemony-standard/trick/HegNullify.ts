import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from '../../FixedTargetTrickCard';

class HegNullify extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('heg-nullify', suit, number);
	}
}

export default HegNullify;
