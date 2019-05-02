
const cmd = require('../cmd');
const GameEvent = require('../driver/GameEvent');
const GameRule = require('../driver/GameRule');
const ServerPlayer = require('../driver/ServerPlayer');
const Phase = require('../core/Player/Phase');
const PhaseChangeStruct = require('../driver/PhaseChangeStruct');

const shuffle = require('../util/shuffle');

class BasicGameRule extends GameRule {

	constructor() {
		super(GameEvent.StartGame);
	}

	preparePlayers(driver) {
		const users = driver.room.users;

		const players = users.map(user => new ServerPlayer(user));
		driver.players = players;
	}

	prepareSeats(driver) {
		const players = driver.players;

		let seat = 1;
		for (const player of players) {
			player.seat = seat;
			seat++;
		}

		driver.room.broadcast(cmd.ArrangeSeats, players.map(player => ({
			uid: player.id,
			seat: player.seat,
			name: player.name,
		})));
	}

	prepareCards(driver) {
		const cards = driver.createCards();
		shuffle(cards);
		driver.resetDrawPile(cards);

		for (const player of driver.players) {
			driver.drawCards(player, 4);
		}
	}

	async activatePlayer(driver, player) {
		const phases = [
			Phase.Start,
			Phase.Judge,
			Phase.Draw,
			Phase.Play,
			Phase.Discard,
			Phase.End,
		];

		for (const phase of phases) {
			const data = new PhaseChangeStruct(player, player.phase(), phase);
			if (await driver.trigger(GameEvent.StartPhase, player, data)) {
				continue;
			}

			player.setPhase(data.to);
			player.broadcastProperty('phase', data.to);
			await driver.trigger(GameEvent.ProceedPhase, player, data);

			await driver.trigger(GameEvent.EndPhase, player, data);
		}

		player.setPhase(Phase.Inactive);
		player.broadcastProperty('phase', Phase.Inactive);
	}

}

module.exports = {
	BasicGameRule,
};
