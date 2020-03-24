import {
	PlayerPhase as Phase,
	CardSuit as Suit,
} from '@karuta/sanguosha-core';

import BasicCard from '../../BasicCard';

import GameDriver from '../../../driver/GameDriver';
import ServerPlayer from '../../../driver/ServerPlayer';
import Damage from '../../../driver/Damage';
import CardEffect from '../../../driver/CardEffect';

class Strike extends BasicCard {
	constructor(suit: Suit, number: number) {
		super('strike', suit, number);
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return driver && source && source.getPhase() === Phase.Play;
	}

	async targetFilter(driver: GameDriver, selected: ServerPlayer[], target: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		if (selected.length > 0 || !target) {
			return false;
		}

		if (!source) {
			return true;
		}

		const inRange = await driver.isInAttackRange(source, target);
		return inRange;
	}

	async targetFeasible(driver: GameDriver, selected: ServerPlayer[]): Promise<boolean> {
		return driver && selected.length === 1;
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		if (!effect.to || effect.to.isDead()) {
			return;
		}

		const damage = new Damage(effect.from, effect.to, 1);
		damage.card = this;
		driver.damage(damage);
	}
}

export default Strike;
