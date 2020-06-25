import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../../base/WeaponCard';

class GreenDragonCrescentBlade extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('green-dragon-crescent-blade', suit, number);
	}
}

export default GreenDragonCrescentBlade;
