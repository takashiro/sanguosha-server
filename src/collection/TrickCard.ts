import {
	CardType as Type,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import Card from '../driver/Card';
import CardUse from '../driver/CardUse';
import GameDriver from '../driver/GameDriver';
import ServerPlayer from '../driver/ServerPlayer';

abstract class TrickCard extends Card {
	getType(): Type {
		return Type.Trick;
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return driver && source && source.getPhase() === Phase.Play;
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

export default TrickCard;
