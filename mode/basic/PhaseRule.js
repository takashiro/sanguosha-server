
const GameRule = require('../../driver/GameRule');

const Phase = require('../../core/Player/Phase');
const GameEvent = require('../../driver/GameEvent');

class PhaseRule extends GameRule {

	constructor() {
		super(GameEvent.ProceedPhase);
	}

	async effect(driver, player, data) {
		switch (data.to) {
		case Phase.Draw:
			await this.drawCards(driver, player);
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

}

module.exports = PhaseRule;
