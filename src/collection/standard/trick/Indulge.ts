import {
	CardSuit as Suit,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import DelayedTrickCard from '../../DelayedTrickCard';
import GameDriver from '../../../driver/GameDriver';
import CardEffect from '../../../driver/CardEffect';
import Judgement from '../../../driver/Judgement';
import CardPattern from '../../../core/CardPattern';

const effectivePattern = new CardPattern({
	suits: [
		Suit.Spade,
		Suit.Club,
		Suit.Diamond,
	],
});

class Indulge extends DelayedTrickCard {
	constructor(suit: Suit, number: number) {
		super('indulge', suit, number);
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { to } = effect;
		if (!to) {
			return;
		}

		const judgement = new Judgement(to, this, effectivePattern);
		await driver.judge(judgement);

		if (judgement.effective) {
			to.skipPhase(Phase.Play);
		}
	}
}

export default Indulge;
