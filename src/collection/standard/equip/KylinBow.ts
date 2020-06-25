import { CardSuit as Suit } from '@karuta/sanguosha-core';

import WeaponCard from '../../../base/WeaponCard';

class KylinBow extends WeaponCard {
	constructor(suit: Suit, number: number) {
		super('kylin-bow', suit, number);
	}
}

export default KylinBow;
