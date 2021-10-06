import { Method } from '@karuta/core';
import {
	Context,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';
import { EventType as GameEvent } from '@karuta/sanguosha-pack';

import BasicRule from '../../../src/mode/basic/BasicRule';

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
		getConfig() { return {}; },
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
		trigger() {
			// do nothing
		},
	};

	const rule = new BasicRule();
	rule.setDriver(driver);
	rule.idle = 0;

	it('binds to start event', () => {
		expect(rule.event).toBe(GameEvent.StartingGame);
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
		expect(room.broadcast).toBeCalledWith(Method.Put, Context.Players, players);
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
				if (event === GameEvent.ChangingPhase && data.to === Phase.Draw) {
					return true;
				}
				if (event === GameEvent.ChangingPhase && data.to === Phase.End) {
					driver.stop();
					return true;
				}
			}
			return false;
		};

		await rule.proceed();

		const phases1 = [
			Phase.Start,
			Phase.Judge,
			Phase.Draw,
			Phase.Play,
			Phase.Discard,
			Phase.End,
			Phase.Inactive,
		];
		expect(players[0].setPhase).toBeCalledTimes(phases1.length);
		for (let i = 0; i < phases1.length; i++) {
			expect(players[0].setPhase).nthCalledWith(i + 1, phases1[i]);
		}

		const phases2 = [
			Phase.Start,
			Phase.Judge,
			Phase.Play,
			Phase.Discard,
			Phase.Inactive,
		];
		expect(players[1].setPhase).toBeCalledTimes(phases2.length);
		for (let i = 0; i < phases2.length; i++) {
			expect(players[1].setPhase).nthCalledWith(i + 1, phases2[i]);
		}
	});
});
