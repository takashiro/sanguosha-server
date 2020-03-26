import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from '../../FixedTargetTrickCard';

class HegNullification extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('heg-nullification', suit, number);
	}
}

export default HegNullification;
