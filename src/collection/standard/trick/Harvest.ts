import { CardSuit as Suit } from '@karuta/sanguosha-core';

import CardAction from '../../../core/CardAction';

import GameDriver from '../../../driver';
import CardEffect from '../../../driver/CardEffect';
import CardUse from '../../../driver/CardUse';

import GlobalEffectTrickCard from '../../../base/GlobalEffectTrickCard';

class Harvest extends GlobalEffectTrickCard {
	constructor(suit: Suit, number: number) {
		super('harvest', suit, number);
	}

	async use(driver: GameDriver, use: CardUse): Promise<boolean> {
		const instant = await super.use(driver, use);
		const players = driver.getAlivePlayers();
		const cards = driver.getCardsFromDrawPile(players.length);
		await driver.moveCards(cards, driver.getWuguArea(), { open: true });
		return instant;
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { to } = effect;
		if (!to || to.isDead()) {
			return;
		}

		const wuguArea = driver.getWuguArea();
		const cards = await to.askForCards([wuguArea], {
			action: CardAction.Obtain,
			minNum: 1,
			maxNum: 1,
		});

		if (cards.length > 0) {
			await driver.moveCards(cards, to.getHandArea(), { open: true });
		}
	}

	async complete(driver: GameDriver, use?: CardUse): Promise<void> {
		const wuguArea = driver.getWuguArea();
		const cards = wuguArea.getCards();
		if (cards.length > 0) {
			await driver.moveCards(cards, driver.getDiscardPile(), { open: true });
		}

		super.complete(driver, use);
	}
}

export default Harvest;
