
const Card = require('../core/Card');

class BasicCard extends Card {
	async use(driver, use) {
		const { card } = use;
		if (!card.isReal()) {
			return;
		}

		const handArea = use.from.getHandArea();
		const processArea = use.from.getProcessArea();
		driver.moveCards([card], handArea, processArea, { open: true });
	}

	async complete(driver, use) {
		const { card } = use;
		if (!card.isReal()) {
			return;
		}

		const processArea = use.from.getProcessArea();
		const discardPile = driver.getDiscardPile();
		driver.moveCards([use.card], processArea, discardPile, { open: true });
	}
}

module.exports = BasicCard;
