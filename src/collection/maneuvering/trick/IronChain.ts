import { CardSuit as Suit } from '@karuta/sanguosha-core';

import InstantTrickCard from '../../InstantTrickCard';

class IronChain extends InstantTrickCard {
	constructor(suit: Suit, number: number) {
		super('iron-chain', suit, number);
	}
}

export default IronChain;
