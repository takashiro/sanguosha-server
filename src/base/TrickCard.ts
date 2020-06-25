import {
	CardType as Type,
	PlayerPhase as Phase,
	CardAreaType,
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

	async complete(driver: GameDriver, use?: CardUse): Promise<void> {
		if (!this.isReal()) {
			return;
		}

		const processArea = use ? use.from.getProcessArea() : this.getLocation();
		if (!processArea || processArea.getType() !== CardAreaType.Process) {
			return;
		}

		if (processArea.has(this)) {
			const discardPile = driver.getDiscardPile();
			await driver.moveCards([this], discardPile, { open: true });
		}
	}
}

export default TrickCard;
