import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from './MonadicTrickCard';

class Dismantle extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('dismantle', suit, number);
	}
}

export default Dismantle;
