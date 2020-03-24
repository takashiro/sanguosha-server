import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../../TrickCard';

class Ease extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('ease', suit, number);
	}
}

export default Ease;
