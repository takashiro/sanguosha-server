
const GameRule = require('../../driver/GameRule');

const GameEvent = require('../../driver/GameEvent');
const Phase = require('../../core/Player/Phase');

class DrawPhaseRule extends GameRule {

	constructor() {
		super(GameEvent.ProceedPhase);
	}

	triggerable(driver, player) {
		return driver && player.phase() === Phase.Draw;
	}

	async effect(driver, player) {
		const data = {
			cardNum: 2
		};
		await driver.trigger(GameEvent.DrawNCards, player, data);
		driver.drawCards(player, data.cardNum);
	}

}

module.exports = DrawPhaseRule;
