import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../WeaponCard';

class PheonixFan extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('pheonix-fan', suit, number);
	}
}

export default PheonixFan;
