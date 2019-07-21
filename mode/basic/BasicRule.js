
const GameRule = require('../../driver/GameRule');

const cmd = require('../../cmd');
const Phase = require('../../core/Player/Phase');
const GameEvent = require('../../driver/GameEvent');
const ServerPlayer = require('../../driver/ServerPlayer');
const PhaseChangeStruct = require('../../driver/PhaseChangeStruct');
const shuffle = require('../../util/shuffle');
const delay = require('../../util/delay');

class BasicRule extends GameRule {

	constructor() {
		super(GameEvent.StartGame);
		this.idle = 1000;
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
			player.setSeat(seat);
			seat++;
		}

		driver.room.broadcast(cmd.ArrangeSeats, players.map(player => ({
			uid: player.id,
			seat: player.seat(),
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

			await delay(this.idle);
		}

		player.setPhase(Phase.Inactive);
		player.broadcastProperty('phase', Phase.Inactive);
	}

	async proceed(driver) {
		let i = 0;
		const players = driver.players;
		while (driver.isRunning()) {
			const player = players[i];
			await this.activatePlayer(driver, player);

			i++;
			if (i >= players.length) {
				i = 0;
			}
		}
	}

}

module.exports = BasicRule;
