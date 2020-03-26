import {
	CardType as Type,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import Card from '../driver/Card';
import GameDriver from '../driver/GameDriver';
import ServerPlayer from '../driver/ServerPlayer';

abstract class TrickCard extends Card {
	getType(): Type {
		return Type.Trick;
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return driver && source && source.getPhase() === Phase.Play;
	}
}

export default TrickCard;
