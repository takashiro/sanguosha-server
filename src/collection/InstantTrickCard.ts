import {
	CardSubtype as Subtype,
} from '@karuta/sanguosha-core';

import TrickCard from './TrickCard';
import GameDriver from '../driver/GameDriver';
import CardUse from '../driver/CardUse';

class InstantTrickCard extends TrickCard {
	getSubtype(): Subtype {
		return Subtype.InstantTrick;
	}

	async use(driver: GameDriver, use: CardUse): Promise<boolean> {
		const { card } = use;
		if (!card.isReal()) {
			return true;
		}

		const processArea = use.from.getProcessArea();
		await driver.moveCards([card], processArea, { open: true });
		return true;
	}

	async complete(driver: GameDriver, use: CardUse): Promise<void> {
		const { card } = use;
		if (!card.isReal()) {
			return;
		}

		const processArea = use.from.getProcessArea();
		if (processArea.has(use.card)) {
			const discardPile = driver.getDiscardPile();
			await driver.moveCards([use.card], discardPile, { open: true });
		}
	}
}

export default InstantTrickCard;
