import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../WeaponCard';

class Triblade extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('triblade', suit, number);
	}
}

export default Triblade;
