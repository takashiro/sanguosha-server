import CardAction from '../../core/CardAction';
import CardPattern from '../../core/CardPattern';

import Card from '../../driver/Card';
import GameEvent from '../../driver/GameEvent';
import GameRule from '../../driver/GameRule';
import CardEffectStruct from '../../driver/CardEffectStruct';
import CardUse from '../../driver/CardUse';

class StrikeRule extends GameRule<CardEffectStruct> {
	constructor() {
		super(GameEvent.TakeCardEffect);
	}

	isTriggerable(effect: CardEffectStruct): boolean {
		const { use } = effect;
		if (!use.card) {
			return false;
		}

		const cardName = use.card.getName();
		if (cardName !== 'strike' && !cardName.endsWith('-strike')) {
			return false;
		}

		const { to } = effect;
		if (!to) {
			return false;
		}

		return to.isAlive();
	}

	async effect(effect: CardEffectStruct): Promise<boolean> {
		const { to } = effect;
		if (!to || !to.isAlive()) {
			return false;
		}

		while (effect.isValid()) {
			let dodge: Card;
			try {
				const cards = await to.askForCards(to.getHandArea(), {
					action: CardAction.Use,
					num: 1,
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

export default StrikeRule;
