import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class BarbarianInvasion extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('barbarian-invasion', suit, number);
	}
}

export default BarbarianInvasion;
