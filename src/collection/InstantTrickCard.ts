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

export default InstantTrickCard;
