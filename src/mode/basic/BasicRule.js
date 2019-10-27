
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

	preparePlayers() {
		const { driver } = this;
		const users = driver.getUsers();

		const players = users.map((user) => new ServerPlayer(user));
		driver.players = players;
	}

	prepareSeats() {
		const { driver } = this;
		const { players } = driver;

		let seat = 1;
		for (const player of players) {
			player.setSeat(seat);
			seat++;
		}

		driver.room.broadcast(cmd.ArrangeSeats, players.map((player) => ({
			uid: player.id,
			seat: player.getSeat(),
			name: player.name,
		})));
	}

	prepareCards() {
		const { driver } = this;
		const cards = driver.createCards();
		shuffle(cards);
		driver.resetDrawPile(cards);

		for (const player of driver.players) {
			driver.drawCards(player, 4);
		}
	}

	async activatePlayer(player) {
		const phases = [
			Phase.Start,
			Phase.Judge,
			Phase.Draw,
			Phase.Play,
			Phase.Discard,
			Phase.End,
		];
		const { driver } = this;

		for (const phase of phases) {
			const data = new PhaseChangeStruct(player, player.getPhase(), phase);
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

	prepareBattleField() {
		const { driver } = this;
		driver.room.broadcast(cmd.ToBattle);
	}

	async proceed() {
		const { driver } = this;
		let i = 0;
		const { players } = driver;
		while (driver.isRunning()) {
			const player = players[i];
			await this.activatePlayer(player);

			i++;
			if (i >= players.length) {
				i = 0;
			}
		}
	}
}

module.exports = BasicRule;
