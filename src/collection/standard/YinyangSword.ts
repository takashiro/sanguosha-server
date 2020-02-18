import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../WeaponCard';

class YinyangSword extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('yinyang-sword', suit, number);
	}
}

export default YinyangSword;
