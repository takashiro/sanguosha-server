import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../../base/MonadicTrickCard';

class Scout extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('scout', suit, number);
	}
}

export default Scout;
