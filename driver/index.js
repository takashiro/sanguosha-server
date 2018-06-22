
const cmd = require('../protocol');
const Player = require('../core/Player');

class GameDriver {

	constructor(room) {
		this.room = room;
		this.players = [];
		this.capacity = 8;
	}

	start() {
		let users = this.room.users;
		this.players = new Array(users.length);
		for (let i = 0; i < users.length; i++) {
			let player = new Player(users[i]);
			player.seat = i + 1;
			this.players[i] = player;
		}

		this.room.broadcast(cmd.StartGame);
	}

}

module.exports = GameDriver;
