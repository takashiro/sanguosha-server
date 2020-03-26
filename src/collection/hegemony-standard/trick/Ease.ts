import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from '../../FixedTargetTrickCard';

class Ease extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('ease', suit, number);
	}
}

export default Ease;
