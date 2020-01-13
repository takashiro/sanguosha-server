import { Card } from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

class CardUseStruct {
	from: ServerPlayer;

	card: Card;

	to: ServerPlayer[];

	constructor(from: ServerPlayer, card: Card, to?: ServerPlayer[]) {
		this.from = from;
		this.card = card;
		this.to = to || [];
	}
}

export default CardUseStruct;
