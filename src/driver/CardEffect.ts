import Card from './Card';
import ServerPlayer from './ServerPlayer';
import CardUse from './CardUse';

abstract class CardEffect {
	card: Card;

	weight: number;

	to?: ServerPlayer;

	origin?: CardEffect;

	constructor(card: Card, to?: ServerPlayer | CardEffect) {
		this.card = card;
		this.weight = 1;

		if (to) {
			if (to instanceof ServerPlayer) {
				this.to = to;
			} else if (to instanceof CardEffect) {
				this.origin = to;
			}
		}
	}

	isValid(): boolean {
		return this.weight > 0;
	}

	abstract get from(): ServerPlayer | undefined;

	abstract get use(): CardUse | undefined;
}

export default CardEffect;
