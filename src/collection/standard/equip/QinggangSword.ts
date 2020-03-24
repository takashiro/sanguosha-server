import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../WeaponCard';

class QinggangSword extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('qinggang-sword', suit, number);
	}
}

export default QinggangSword;
