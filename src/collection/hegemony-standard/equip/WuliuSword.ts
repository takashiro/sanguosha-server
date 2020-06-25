import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../../base/WeaponCard';

class WuliuSword extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('wuliu-sword', suit, number);
	}
}

export default WuliuSword;
