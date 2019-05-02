
const cmd = require('../cmd');
const GameEvent = require('../driver/GameEvent');
const GameRule = require('../driver/GameRule');
const ServerPlayer = require('../driver/ServerPlayer');

const shuffle = require('../util/shuffle');

class GameStartRule extends GameRule {

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

}

module.exports = {
	GameStartRule
};
