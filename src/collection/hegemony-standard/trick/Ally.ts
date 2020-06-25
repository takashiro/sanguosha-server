import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../../base/MonadicTrickCard';

class Ally extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('ally', suit, number);
	}
}

export default Ally;
