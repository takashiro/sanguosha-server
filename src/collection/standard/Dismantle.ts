import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Dismantle extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('dismantle', suit, number);
	}
}

export default Dismantle;
