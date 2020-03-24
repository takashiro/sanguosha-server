import { CardSuit as Suit } from '@karuta/sanguosha-core';

import GlobalEffectTrickCard from '../../GlobalEffectTrickCard';

class PeachGarden extends GlobalEffectTrickCard {
	constructor(suit: Suit, number: number) {
		super('peach-garden', suit, number);
	}
}

export default PeachGarden;
