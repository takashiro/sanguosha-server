import { Method, Room } from '@karuta/core';
import {
	Context,
	Player,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';
import {
	GameDriver,
	EventType as GameEvent,
	PhaseChange,
} from '@karuta/sanguosha-pack';

import BasicRule from '../../../src/mode/basic/BasicRule';

class MockUser {
	constructor(protected room: Room, protected id: number, protected name: string) {
		this.room = room;
		this.id = id;
		this.name = name;
	}

	getRoom(): Room {
		return this.room;
	}

	getId(): number {
		return this.id;
	}

	getName(): string {
		return this.name;
	}
}

describe('Basic Rule', () => {
	const room = {
		broadcast: jest.fn(),
	} as unknown as Room;

	const users = [
		new MockUser(room, 1, 'user1'),
		new MockUser(room, 2, 'user2'),
	];

	const driver = {
		getConfig(): unknown { return {}; },
		getRoom(): Room {
			return room;
		},
		setCurrentPlayer: jest.fn(),
		setPlayers(players: Player[]): void {
			Reflect.set(driver, 'players', players);
		},
		getPlayers(): Player[] {
			return Reflect.get(driver, 'players');
		},
		getUsers(): MockUser[] { return users; },
		stop(): void {
			Reflect.set(driver, 'finished', true);
		},
		isRunning(): boolean {
			return !Reflect.get(driver, 'finished');
		},
		trigger(): void {
			// do nothing
		},
	} as unknown as GameDriver;

	const rule = new BasicRule();
	rule.setDriver(driver);
	Reflect.set(rule, 'idle', 0);

	it('binds to start event', () => {
		expect(rule.event).toBe(GameEvent.StartingGame);
	});

	it('prepares players', () => {
		rule.preparePlayers();

		const players = driver.getPlayers();
		expect(players.length).toBe(users.length);
		for (let i = 0; i < players.length; i++) {
			expect(players[i].getId()).toBe(users[i].getId());
			expect(players[i].getName()).toBe(users[i].getName());
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

		Reflect.set(driver, 'trigger', (event: number, data: PhaseChange): boolean => {
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
		});

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
