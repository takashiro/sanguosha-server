import { CardType } from '@karuta/sanguosha-core';

import {
	CardAction,
	CardPattern,
	Card,
	CardEffect,
	CardUse,
	EventType as GameEvent,
	Player,
} from '@karuta/sanguosha-pack';

import GameRule from '../../driver/GameRule';

interface Response {
	player: Player;
	card: Card;
}

class TrickEffectRule extends GameRule<CardEffect> {
	constructor() {
		super(GameEvent.BeforeTakingCardEffect);
	}

	isTriggerable(effect: CardEffect): boolean {
		const { use } = effect;
		if (!use) {
			return false;
		}

		const { card } = use;
		return card && card.getType() === CardType.Trick;
	}

	async process(effect: CardEffect): Promise<boolean> {
		const driver = this.getDriver();

		while (effect.isValid()) {
			let res: Response;
			try {
				res = await this.broadcastNullificationRequest();
			} catch (timeout) {
				return false;
			}

			if (!res) {
				return false;
			}

			const use = new CardUse(res.player, res.card);
			await driver.useCard(use, effect);
		}

		return false;
	}

	broadcastNullificationRequest(): Promise<Response> {
		const driver = this.getDriver();
		const players = driver.getAlivePlayers();
		return new Promise((resolve, reject) => {
			Promise.all(players.map(async (player) => {
				const cards = await player.askForCards([player.getHandArea()], {
					action: CardAction.Use,
					minNum: 0,
					maxNum: 1,
					pattern: new CardPattern({ namePostfix: 'nullify' }),
					autoSkip: true,
				});

				if (cards && cards.length > 0) {
					resolve({
						player,
						card: cards[0] as Card,
					});
				}
			})).then(reject);
		});
	}
}

export default TrickEffectRule;
