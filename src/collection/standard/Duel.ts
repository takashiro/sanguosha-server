import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Duel extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('duel', suit, number);
	}
}

export default Duel;
