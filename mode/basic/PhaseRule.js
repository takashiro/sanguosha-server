
const GameRule = require('../../driver/GameRule');

const Phase = require('../../core/Player/Phase');
const GameEvent = require('../../driver/GameEvent');

class PhaseRule extends GameRule {

	constructor() {
		super(GameEvent.ProceedPhase);
	}

	triggerable(driver, target) {
		return driver && target;
	}

	async effect(driver, player, data) {
		switch (data.to) {
		case Phase.Draw:
			await this.drawCards(driver, player);
			break;
		case Phase.Discard:
			await this.discardCards(driver, player);
			break;
		default:
			break;
		}
	}

	async drawCards(driver, player) {
		const data = {
			num: 2
		};
		await driver.trigger(GameEvent.DrawNCards, player, data);
		await driver.drawCards(player, data.num);
	}

	async discardCards(driver, player) {
		const handArea = player.handArea;
		const discardNum = handArea.size - player.hp();
		const selected = await player.askForCards(player.handArea, {
			num: discardNum,
		});
		driver.moveCards(selected, handArea, driver.discardPile, {open: true});
	}

}

module.exports = PhaseRule;
