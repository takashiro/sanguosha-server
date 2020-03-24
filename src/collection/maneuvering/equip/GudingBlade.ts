import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../WeaponCard';

class GudingBlade extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('guding-blade', suit, number);
	}
}

export default GudingBlade;
