import { CardExpenseStruct } from '@karuta/sanguosha-core';

import Card from './Card';
import ServerPlayer from './ServerPlayer';
import CardEffectStruct from './CardEffectStruct';

export default class CardExpense {
	player: ServerPlayer;

	card: Card;

	origin?: CardEffectStruct;

	constructor(player: ServerPlayer, card: Card) {
		this.player = player;
		this.card = card;
	}

	toJSON(): CardExpenseStruct {
		return {
			player: this.player.getSeat(),
			card: this.card.toJSON(),
		};
	}
}
