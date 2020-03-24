import { CardSuit as Suit } from '@karuta/sanguosha-core';

import Strike from '../../standard/basic/Strike';

class ThunderStrike extends Strike {
	constructor(suit: Suit, number: number) {
		super(suit, number);
		this.name = 'thunder-strike';
	}
}

export default ThunderStrike;
