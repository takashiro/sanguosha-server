import { CardSuit as Suit } from '@karuta/sanguosha-core';

import Strike from '../standard/basic/Strike';

class FireStrike extends Strike {
	constructor(suit: Suit, number: number) {
		super(suit, number);
		this.name = 'fire-strike';
	}
}

export default FireStrike;
