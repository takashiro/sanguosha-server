import { Card } from '@karuta/sanguosha-core';
import { Player } from '@karuta/sanguosha-pack';

export default class CardConstraint {
	readonly player: Player;

	readonly card: Card;

	available: boolean;

	constructor(player: Player, card: Card) {
		this.player = player;
		this.card = card;
		this.available = true;
	}

	isAvailable(): boolean {
		return this.available;
	}
}
