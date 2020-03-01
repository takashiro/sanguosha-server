import {
	Command as cmd,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import GameEvent from '../src/driver/GameEvent';
import BasicRule from '../src/mode/basic/BasicRule';

class MockUser {
	constructor(room, id, name) {
		this.room = room;
		this.id = id;
		this.name = name;
	}

	getRoom() {
		return this.room;
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}
}

describe('Basic Rule', () => {
	const room = {
		broadcast: jest.fn(),
	};

	const users = [
		new MockUser(room, 1, 'user1'),
		new MockUser(room, 2, 'user2'),
	];

	const driver = {
		getRoom() {
			return room;
		},
		setCurrentPlayer: jest.fn(),
		setPlayers(players) {
			this.players = players;
		},
		getPlayers() {
			return this.players;
		},
		getUsers() { return users; },
		stop() {
			this.finished = true;
		},
		isRunning() {
			return !this.finished;
		},
		trigger() {},
	};

	const rule = new BasicRule();
	rule.setDriver(driver);
	rule.idle = 0;

	it('binds to start event', () => {
		expect(rule.event).toBe(GameEvent.StartGame);
	});

	it('prepares players', () => {
		rule.preparePlayers();

		const players = driver.getPlayers();
		expect(players.length).toBe(users.length);
		for (let i = 0; i < players.length; i++) {
			expect(players[i].getId()).toBe(users[i].id);
			expect(players[i].getName()).toBe(users[i].name);
		}
	});

	it('prepares seats', () => {
		rule.prepareSeats();
		const players = driver.getPlayers().map((player) => ({
			uid: player.getId(),
			seat: player.getSeat(),
			name: player.getName(),
		}));
		expect(room.broadcast).toBeCalledWith(cmd.ArrangeSeats, players);
	});

	it('activates a player', async () => {
		const player = driver.getPlayers()[0];
		const setPhase = jest.spyOn(player, 'setPhase');
		await rule.activatePlayer(player);

		expect(setPhase).toBeCalledTimes(7);
		for (let i = 0; i < 6; i++) {
			expect(setPhase).nthCalledWith(i + 1, i + 1);
		}
		expect(setPhase).nthCalledWith(7, Phase.Inactive);

		setPhase.mockRestore();
	});

	it('proceeds the game', async () => {
		const players = driver.getPlayers();
		for (const player of players) {
			player.setPhase = jest.fn();
		}

		driver.trigger = (event, data) => {
			const { player } = data;
			if (player === players[1]) {
				if (event === GameEvent.StartPhase && data.to === Phase.Draw) {
					return true;
				}
				if (event === GameEvent.EndPhase && data.to === Phase.End) {
					driver.stop();
					return true;
				}
			}
			return false;
		};

		await rule.proceed();

		const phases = [
			Phase.Start,
			Phase.Judge,
			Phase.Draw,
			Phase.Play,
			Phase.Discard,
			Phase.End,
			Phase.Inactive,
		];
		expect(players[0].setPhase).toBeCalledTimes(7);
		for (let i = 0; i < 7; i++) {
			expect(players[0].setPhase).nthCalledWith(i + 1, phases[i]);
		}

		phases.splice(2, 1);
		expect(players[1].setPhase).toBeCalledTimes(6);
		for (let i = 0; i < 6; i++) {
			expect(players[1].setPhase).nthCalledWith(i + 1, phases[i]);
		}
	});
});
