import { Card } from '@karuta/sanguosha-core';
import ServerPlayer from './ServerPlayer';

export default class CardConstraint {
	readonly player: ServerPlayer;

	readonly card: Card;

	available: boolean;

	constructor(player: ServerPlayer, card: Card) {
		this.player = player;
		this.card = card;
		this.available = true;
	}

	isAvailable(): boolean {
		return this.available;
	}
}
