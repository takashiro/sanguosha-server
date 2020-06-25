import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../../base/MonadicTrickCard';

class FireAttack extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('fire-attack', suit, number);
	}
}

export default FireAttack;
