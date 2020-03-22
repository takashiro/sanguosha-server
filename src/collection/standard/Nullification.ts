import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class Nullification extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('nullification', suit, number);
	}

	async isAvailable(): Promise<boolean> {
		return false;
	}
}

export default Nullification;
