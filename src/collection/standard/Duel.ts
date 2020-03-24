import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from './MonadicTrickCard';

class Duel extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('duel', suit, number);
	}
}

export default Duel;
