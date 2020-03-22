import {
	CardSuit as Suit,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import TrickCard from '../TrickCard';

import GameDriver from '../../driver/GameDriver';
import ServerPlayer from '../../driver/ServerPlayer';
import CardEffectStruct from '../../driver/CardEffectStruct';
import CardUseStruct from '../../driver/CardUseStruct';

class ExNihilo extends TrickCard {
	constructor(suit: Suit, number: number) {
		super('ex-nihilo', suit, number);
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return driver && source && source.getPhase() === Phase.Play;
	}

	async targetFilter(): Promise<boolean> {
		return false;
	}

	async targetFeasible(): Promise<boolean> {
		return true;
	}

	async onUse(driver: GameDriver, use: CardUseStruct): Promise<void> {
		const { from } = use;
		use.to.push(from);
	}

	async effect(driver: GameDriver, effect: CardEffectStruct): Promise<void> {
		const { to } = effect;
		if (to) {
			driver.drawCards(to, 2);
		}
	}
}

export default ExNihilo;
