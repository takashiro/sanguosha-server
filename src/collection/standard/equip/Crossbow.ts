import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../../base/WeaponCard';

class Crossbow extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('crossbow', suit, number);
	}
}

export default Crossbow;
