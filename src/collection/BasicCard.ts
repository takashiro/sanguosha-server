import { CardType as Type } from '@karuta/sanguosha-core';
import Card from '../driver/Card';

import GameDriver from '../driver/GameDriver';
import CardUse from '../driver/CardUse';

class BasicCard extends Card {
	getType(): Type {
		return Type.Basic;
	}

	async use(driver: GameDriver, use: CardUse): Promise<void> {
		const { card } = use;
		if (!card.isReal()) {
			return;
		}

		const handArea = use.from.getHandArea();
		const processArea = use.from.getProcessArea();
		driver.moveCards([card], handArea, processArea, { open: true });
	}

	async complete(driver: GameDriver, use: CardUse): Promise<void> {
		const { card } = use;
		if (!card.isReal()) {
			return;
		}

		const processArea = use.from.getProcessArea();
		const discardPile = driver.getDiscardPile();
		driver.moveCards([use.card], processArea, discardPile, { open: true });
	}
}

export default BasicCard;
