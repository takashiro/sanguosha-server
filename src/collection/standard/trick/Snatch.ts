import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../../base/MonadicTrickCard';
import GameDriver from '../../../driver/GameDriver';
import ServerPlayer from '../../../driver/ServerPlayer';
import CardEffect from '../../../driver/CardEffect';
import CardAction from '../../../core/CardAction';

class Snatch extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('snatch', suit, number);
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		const others = driver.getAlivePlayersExcept(source);
		for (const other of others) {
			if (other.isEmpty()) {
				continue;
			}

			const distance = await driver.getDistance(source, other);
			if (distance <= 1) {
				return true;
			}
		}
		return false;
	}

	async filterPlayer(driver: GameDriver, selected: ServerPlayer[], target: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		if (!super.filterPlayer(driver, selected, target, source)) {
			return false;
		}

		if (target.isEmpty()) {
			return false;
		}

		const distance = await driver.getDistance(source, target);
		return distance <= 1;
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { from, to } = effect;
		if (!from || !to || from.isDead() || to.isDead()) {
			return;
		}

		if (to.isEmpty()) {
			return;
		}

		const cards = await from.askForCards(to.getCardAreas(), {
			action: CardAction.Obtain,
			minNum: 1,
			maxNum: 1,
		});

		if (!cards || cards.length <= 0) {
			return;
		}

		await driver.moveCards(cards, from.getHandArea(), { openTo: [from, to] });
	}
}

export default Snatch;
