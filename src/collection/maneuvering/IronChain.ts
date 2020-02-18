import { CardSuit as Suit } from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

class IronChain extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('iron-chain', suit, number);
	}
}

export default IronChain;
