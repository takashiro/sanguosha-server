import { CardSuit as Suit } from '@karuta/sanguosha-core';

import FixedTargetTrickCard from './FixedTargetTrickCard';

import GameDriver from '../../driver/GameDriver';
import CardEffect from '../../driver/CardEffect';
import CardUse from '../../driver/CardUse';

class ExNihilo extends FixedTargetTrickCard {
	constructor(suit: Suit, number: number) {
		super('ex-nihilo', suit, number);
	}

	async onUse(driver: GameDriver, use: CardUse): Promise<void> {
		const { from } = use;
		use.to.push(from);
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { to } = effect;
		if (to) {
			driver.drawCards(to, 2);
		}
	}
}

export default ExNihilo;
