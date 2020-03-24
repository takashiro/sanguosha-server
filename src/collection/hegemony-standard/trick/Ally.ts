import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../../TrickCard';

class Ally extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('ally', suit, number);
	}
}

export default Ally;
