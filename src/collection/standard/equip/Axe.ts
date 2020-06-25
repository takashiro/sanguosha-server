import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../../base/WeaponCard';

class Axe extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('axe', suit, number);
	}
}

export default Axe;
