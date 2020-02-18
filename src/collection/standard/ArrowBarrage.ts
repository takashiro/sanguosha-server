import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class ArrowBarrage extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('arrow-barrage', suit, number);
	}
}

export default ArrowBarrage;
