import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

import GameRule from '../../driver/GameRule';
import GameEvent from '../../driver/GameEvent';
import PhaseChange from '../../driver/PhaseChange';
import CardDraw from '../../driver/CardDraw';
import Card from '../../driver/Card';
import ServerPlayer from '../../driver/ServerPlayer';
import CardAction from '../../core/CardAction';

class PhaseRule extends GameRule<PhaseChange> {
	constructor() {
		super(GameEvent.ProceedingPhase);
	}

	isTriggerable(data: PhaseChange): boolean {
		return Boolean(this.driver && data && data.player);
	}

	async effect(data: PhaseChange): Promise<boolean> {
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
		const data = new CardDraw(player, 2);
		const driver = this.getDriver();
		await driver.trigger(GameEvent.DrawingNCards, data);
		await driver.drawCards(player, data.num);
	}

	async play(player: ServerPlayer): Promise<void> {
		const driver = this.getDriver();
		const handArea = player.getHandArea();
		for (;;) {
			player.setUseLimit('strike', 1);
			const cards = handArea.getCards();
			const availableCards: Card[] = [];
			for (const ccard of cards) {
				const card = ccard as Card;
				if (await driver.isCardAvailable(player, card)) {
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

		player.clearUseCount();
		player.clearUseLimit();
	}

	async discardCards(player: ServerPlayer): Promise<void> {
		const handArea = player.getHandArea();
		const discardNum = handArea.size - player.getHp();
		if (discardNum > 0) {
			const selected = await player.askForCards(handArea, {
				action: CardAction.Discard,
				minNum: discardNum,
				maxNum: discardNum,
			});
			const driver = this.getDriver();
			driver.moveCards(selected, handArea, driver.getDiscardPile(), { open: true });
		}
	}
}

export default PhaseRule;
