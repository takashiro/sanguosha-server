import { CardSuit as Suit } from '@karuta/sanguosha-core';

import MonadicTrickCard from '../../MonadicTrickCard';
import GameDriver from '../../../driver';
import CardEffect from '../../../driver/CardEffect';
import ServerPlayer from '../../../driver/ServerPlayer';
import CardPattern from '../../../core/CardPattern';
import CardAction from '../../../core/CardAction';
import Damage from '../../../driver/Damage';
import CardExpense from '../../../driver/CardExpense';
import Card from '../../../driver/Card';

class Duel extends MonadicTrickCard {
	constructor(suit: Suit, number: number) {
		super('duel', suit, number);
	}

	async targetFilter(driver: GameDriver, selected: ServerPlayer[], target: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		return super.targetFilter(driver, selected, target, source) && target !== source;
	}

	async onEffect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { from, to } = effect;
		if (!from || !to || from === to) {
			return;
		}

		const players = [to, from];
		let i = 0;
		for (;;) {
			const current = players[i];
			const cards = await current.askForCards(current.getHandArea(), {
				action: CardAction.Expend,
				minNum: 0,
				maxNum: 1,
				pattern: new CardPattern({ namePostfix: 'strike' }),
			});
			if (!cards || cards.length <= 0) {
				break;
			}

			const expense = new CardExpense(current, cards[0] as Card);
			expense.origin = effect;
			await driver.expendCard(expense);

			i = (i + 1) % players.length;
		}

		const loser = players[i];
		const winner = players[(i + 1) % players.length];
		const damage = new Damage(winner, loser, 1);
		damage.card = this;
		await driver.damage(damage);
	}
}

export default Duel;
