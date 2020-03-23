import { CardUseStruct } from '@karuta/sanguosha-core';

import Card from './Card';
import ServerPlayer from './ServerPlayer';

class CardUse {
	from: ServerPlayer;

	card: Card;

	to: ServerPlayer[];

	constructor(from: ServerPlayer, card: Card, to?: ServerPlayer[]) {
		this.from = from;
		this.card = card;
		this.to = to || [];
	}

	toJSON(): CardUseStruct {
		return {
			from: this.from.getSeat(),
			card: this.card.toJSON(),
			to: this.to.length > 0 ? this.to.map((player) => player.getSeat()) : undefined,
		};
	}
}

export default CardUse;
