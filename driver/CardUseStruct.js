
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
		this.target = null;
	}

	toJSON() {
		return {
			from: this.from.getSeat(),
			card: this.card.toJSON(),
			to: this.to.length > 0 ? this.to.map((player) => player.getSeat()) : undefined,
			target: this.target ? this.target.toJSON() : undefined,
		};
	}
}

module.exports = CardUseStruct;
