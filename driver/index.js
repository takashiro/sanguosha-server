
const cmd = require('../core/protocol');
const ServerPlayer = require('./ServerPlayer');
const {shuffle} = require('../core/util');

class GameDriver {

	constructor(room) {
		this.room = room;
		this.players = [];
		this.capacity = 8;
	}

	async start() {
		this.room.broadcast(cmd.StartGame);
		this.arrangeSeats();
		await this.arrangeGenerals();
		this.room.broadcast(cmd.ToBattle);
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

	async arrangeGenerals() {
		let generals = [];

		const Collections = require('../collection');
		for (let Collection of Collections) {
			generals.push(...Collection.generals);
		}

		let candidateNum = 7;
		let players = this.players;
		shuffle(generals);
		generals = generals.splice(0, candidateNum * players.length);

		let sessions = players.map(player => ({
			player: player,
			candidates: [],
			selected: [],
		}));
		for (let i = 0, j = 0; i < generals.length; i++) {
			let session = sessions[j];
			session.candidates.push(generals[i]);
			j++;
			if (j >= sessions.length) {
				j = 0;
			}
		}

		let replies = [];
		for (let s of sessions) {
			replies.push(
				s.player.askForGeneral(s.candidates, {
					timeout: 5, //TO-DO: make this longer
					num: 2,
					sameKingdom: true,
					forced: true,
				})
				.then(generals => {
					s.selected = generals;
				})
			);
		}

		await Promise.all(replies);
		for (let s of sessions) {
			let player = s.player;
			let headGeneral = s.selected[0];
			let deputyGeneral = s.selected[1];
			player.setHeadGeneral(headGeneral);
			player.broadcastProperty('headGeneral', headGeneral.toJSON());
			player.setDeputyGeneral(deputyGeneral);
			player.broadcastProperty('deputyGeneral', deputyGeneral.toJSON());
		}
	}

}

module.exports = GameDriver;
