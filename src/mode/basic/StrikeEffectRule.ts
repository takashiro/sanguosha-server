import {
	CardAction,
	CardPattern,
	Card,
	EventType,
	CardEffect,
	CardUse,
} from '@karuta/sanguosha-pack';

import AbstractStrikeRule from './AbstractStrikeRule';

class StrikeEffectRule extends AbstractStrikeRule<CardEffect> {
	constructor() {
		super(EventType.BeforeTakingCardEffect);
	}

	isTriggerable(effect: CardEffect): boolean {
		const { use } = effect;
		if (!use || !use.card) {
			return false;
		}

		if (!this.isStrike(use.card)) {
			return false;
		}

		const { to } = effect;
		if (!to) {
			return false;
		}

		return to.isAlive();
	}

	async process(effect: CardEffect): Promise<boolean> {
		const { to } = effect;
		if (!to || !to.isAlive()) {
			return false;
		}

		while (effect.isValid()) {
			let dodge: Card;
			try {
				const cards = await to.askForCards([to.getHandArea()], {
					action: CardAction.Use,
					minNum: 0,
					maxNum: 1,
					pattern: new CardPattern({ name: 'dodge' }),
				});
				if (!cards || cards.length < 1) {
					return false;
				}

				dodge = cards[0] as Card;
			} catch (timeout) {
				return false;
			}

			if (!dodge) {
				return false;
			}

			const use = new CardUse(to, dodge);
			const driver = this.getDriver();
			await driver.useCard(use, effect);
		}

		return false;
	}
}

export default StrikeEffectRule;
