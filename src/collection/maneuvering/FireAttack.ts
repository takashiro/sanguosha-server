import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class FireAttack extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('fire-attack', suit, number);
	}
}

export default FireAttack;
