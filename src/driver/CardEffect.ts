import Card from './Card';
import CardUse from './CardUse';
import ServerPlayer from './ServerPlayer';

class CardEffect {
	readonly use: CardUse;

	weight: number;

	to?: ServerPlayer;

	origin?: CardEffect;

	/**
	 * @param use
	 * @param to
	 */
	constructor(use: CardUse, to?: ServerPlayer | CardEffect) {
		this.use = use;
		this.weight = 1;

		if (to) {
			if (to instanceof ServerPlayer) {
				this.to = to;
			} else if (to instanceof CardEffect) {
				this.origin = to;
			}
		}
	}

	get from(): ServerPlayer {
		return this.use.from;
	}

	get card(): Card {
		return this.use.card;
	}

	isValid(): boolean {
		return this.weight > 0;
	}
}

export default CardEffect;
