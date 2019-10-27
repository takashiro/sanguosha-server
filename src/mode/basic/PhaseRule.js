
const GameRule = require('../../driver/GameRule');

const Phase = require('../../core/Player/Phase');
const GameEvent = require('../../driver/GameEvent');

class PhaseRule extends GameRule {
	constructor() {
		super(GameEvent.ProceedPhase);
	}

	isTriggerable(target) {
		return Boolean(this.driver && target);
	}

	async effect(player, data) {
		switch (data.to) {
		case Phase.Draw:
			await this.drawCards(player);
			break;
		case Phase.Discard:
			await this.discardCards(player);
			break;
		default:
			break;
		}
	}

	async drawCards(player) {
		const data = {
			num: 2,
		};

		const { driver } = this;
		await driver.trigger(GameEvent.DrawNCards, player, data);
		await driver.drawCards(player, data.num);
	}

	async discardCards(player) {
		const { handArea } = player;
		const discardNum = handArea.size - player.getHp();
		if (discardNum > 0) {
			const selected = await player.askForCards(player.handArea, {
				num: discardNum,
			});
			const { driver } = this;
			driver.moveCards(selected, handArea, driver.discardPile, { open: true });
		}
	}
}

module.exports = PhaseRule;
