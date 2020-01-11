
class CardUseStruct {
	/**
	 *
	 * @param {Player} from
	 * @param {Card} card
	 */
	constructor(from, card) {
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

module.exports = CardUseStruct;
