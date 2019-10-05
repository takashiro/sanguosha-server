
const GameRule = require('../driver/GameRule');
const cmd = require('../cmd');

class StartGame extends GameRule {
	async effect(driver, player, data) {
		await this.arrangeGenerals();
		this.room.broadcast(cmd.ToBattle);
		this.arrangeCards();
	}
}

module.exports = [
	StartGame,
];
