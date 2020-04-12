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
}

export default InstantTrickCard;
