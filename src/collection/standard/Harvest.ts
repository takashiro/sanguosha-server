import { CardSuit as Suit } from '@karuta/sanguosha-core';

import GlobalEffectTrickCard from './GlobalEffectTrickCard';

class Harvest extends GlobalEffectTrickCard {
	constructor(suit: Suit, number: number) {
		super('harvest', suit, number);
	}
}

export default Harvest;
