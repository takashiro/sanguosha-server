import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../MonadicTrickCard';

class Snatch extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('snatch', suit, number);
	}
}

export default Snatch;
