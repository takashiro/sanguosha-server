import { CardType } from '@karuta/sanguosha-core';

import CardAction from '../../core/CardAction';
import CardPattern from '../../core/CardPattern';

import Card from '../../driver/Card';
import CardEffect from '../../driver/CardEffect';
import CardUse from '../../driver/CardUse';
import GameEvent from '../../driver/GameEvent';
import GameRule from '../../driver/GameRule';
import ServerPlayer from '../../driver/ServerPlayer';

interface Response {
	player: ServerPlayer;
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

	async effect(effect: CardEffect): Promise<boolean> {
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
