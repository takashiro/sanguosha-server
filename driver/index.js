
const cmd = require('../core/protocol');
const ServerPlayer = require('./ServerPlayer');
const {shuffle} = require('../core/util');

class GameDriver {

	constructor(room) {
		this.room = room;
		this.players = [];
		this.capacity = 8;
	}

	start() {
		this.room.broadcast(cmd.StartGame);
		this.arrangeSeats();
		this.arrangeGenerals();
	}

	arrangeSeats() {
		let users = this.room.users;
		this.players = Array.from(users);
		for (let i = 0; i < this.players.length; i++) {
			let player = new ServerPlayer(this.players[i]);
			player.seat = i + 1;
			this.players[i] = player;
		}

		let args = [];
		for (let player of this.players) {
			args.push({
				uid: player.user.id,
				seat: player.seat,
				name: 'Seat ' + player.seat,
			});
		}
		this.room.broadcast(cmd.ArrangeSeats, args);
	}

	arrangeGenerals() {
		let generals = [];

		const Collections = require('../collection');
		for (let Collection of Collections) {
			generals.push(...Collection.generals);
		}

		let candidateNum = 7;
		let players = this.players;
		shuffle(generals);
		generals = generals.splice(0, candidateNum * players.length);

		let parts = players.map(player => ({player: player, candidates: []}));
		for (let i = 0, j = 0; i < generals.length; i++) {
			let part = parts[j];
			part.candidates.push(generals[i]);
			j++;
			if (j >= parts.length) {
				j = 0;
			}
		}

		for (let {player, candidates} of parts) {
			player.askForGeneral(candidates, 2);
		}
	}

}

module.exports = GameDriver;
