import {
	PlayerPhase as Phase,
	CardSuit as Suit,
} from '@karuta/sanguosha-core';

import BasicCard from '../BasicCard';

import GameDriver from '../../driver/GameDriver';
import ServerPlayer from '../../driver/ServerPlayer';
import DamageStruct from '../../driver/DamageStruct';
import CardEffectStruct from '../../driver/CardEffectStruct';

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

	async effect(driver: GameDriver, effect: CardEffectStruct): Promise<void> {
		if (!effect.to) {
			return;
		}

		const damage = new DamageStruct(effect.from, effect.to, 1);
		driver.damage(damage);
	}
}

export default Strike;
