import { Player, Card } from '@karuta/sanguosha-core';

class CardUseStruct {
	from: Player;

	card: Card;

	to: Player[];

	/**
	 *
	 * @param from
	 * @param card
	 */
	constructor(from: Player, card: Card) {
		this.from = from;
		this.card = card;
		this.to = [];
	}

	toJSON() {
		return {
			from: this.from.getSeat(),
			card: this.card.toJSON(),
			to: this.to.length > 0 ? this.to.map((player) => player.getSeat()) : undefined,
		};
	}
}

export default CardUseStruct;
