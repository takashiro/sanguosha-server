import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

import GameRule from '../../driver/GameRule';
import GameEvent from '../../driver/GameEvent';
import PhaseChangeStruct from '../../driver/PhaseChangeStruct';
import DrawCardStruct from '../../driver/DrawCardStruct';
import Card from '../../driver/Card';
import ServerPlayer from '../../driver/ServerPlayer';
import CardAction from '../../core/CardAction';

class PhaseRule extends GameRule<PhaseChangeStruct> {
	constructor() {
		super(GameEvent.ProceedPhase);
	}

	isTriggerable(data: PhaseChangeStruct): boolean {
		return Boolean(this.driver && data && data.player);
	}

	async effect(data: PhaseChangeStruct): Promise<boolean> {
		switch (data.to) {
		case Phase.Draw:
			await this.drawCards(data.player);
			break;
		case Phase.Play:
			await this.play(data.player);
			break;
		case Phase.Discard:
			await this.discardCards(data.player);
			break;
		default:
			break;
		}
		return false;
	}

	async drawCards(player: ServerPlayer): Promise<void> {
		const data: DrawCardStruct = {
			player,
			num: 2,
		};

		const driver = this.getDriver();
		await driver.trigger(GameEvent.DrawNCards, data);
		await driver.drawCards(player, data.num);
	}

	async play(player: ServerPlayer): Promise<void> {
		const driver = this.getDriver();
		const handArea = player.getHandArea();
		for (;;) {
			const cards = handArea.getCards();
			const availableCards: Card[] = [];
			for (const ccard of cards) {
				const card = ccard as Card;
				if (await card.isAvailable(driver, player)) {
					availableCards.push(card);
				}
			}

			const action = await player.play(availableCards);
			if (!action) {
				break;
			}

			const card = action.card as Card;
			if (card) {
				await driver.playCard(player, card);
			}
		}
	}

	async discardCards(player: ServerPlayer): Promise<void> {
		const handArea = player.getHandArea();
		const discardNum = handArea.size - player.getHp();
		if (discardNum > 0) {
			const selected = await player.askForCards(handArea, {
				action: CardAction.Discard,
				num: discardNum,
			});
			const driver = this.getDriver();
			driver.moveCards(selected, handArea, driver.getDiscardPile(), { open: true });
		}
	}
}

export default PhaseRule;
