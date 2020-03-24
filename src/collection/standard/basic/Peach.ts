import {
	CardSuit as Suit,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import BasicCard from '../../BasicCard';
import GameDriver from '../../../driver/GameDriver';
import ServerPlayer from '../../../driver/ServerPlayer';
import CardEffect from '../../../driver/CardEffect';
import RecoverStruct from '../../../driver/RecoverStruct';
import CardUse from '../../../driver/CardUse';

class Peach extends BasicCard {
	constructor(suit: Suit, number: number) {
		super('peach', suit, number);
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return driver && source && source.getPhase() === Phase.Play && source.isWounded();
	}

	async targetFilter(): Promise<boolean> {
		return false;
	}

	async targetFeasible(): Promise<boolean> {
		return true;
	}

	async onUse(driver: GameDriver, use: CardUse): Promise<void> {
		const { from } = use;
		use.to.push(from);
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		if (!effect.to) {
			return;
		}

		const recover = new RecoverStruct(effect.from, effect.to, 1);
		driver.recover(recover);
	}
}

export default Peach;
