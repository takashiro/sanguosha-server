import { Method, Room, User } from '@karuta/core';
import { Card, Context } from '@karuta/sanguosha-core';
import { Player } from '@karuta/sanguosha-pack';

import GameDriver from '../../src/driver';

describe('GameDriver', () => {
	const room = {
		broadcast: jest.fn(),
	} as unknown as Room;
	const driver = new GameDriver(room);

	it('returns a descriptive profile', () => {
		const profile = driver.getProfile();
		expect(profile.name).toBe('sanguosha');
		expect(profile.config.mode).toBe('standard');
		expect(profile.config.capacity).toBeGreaterThan(0);
		expect(profile.config.requestTimeout).toBeGreaterThan(0);
		expect(profile.config.packs).toBeUndefined();
	});

	it('updates game configuration', () => {
		driver.updateConfig({
			mode: 'standard',
			capacity: 2,
			packs: ['@karuta/sanguosha-standard'],
			requestTimeout: 15 * 1000,
		});
	});

	it('binds actions to a user', () => {
		const user = {} as unknown as User;
		const actions = driver.createContextListeners(user);
		expect(actions).toHaveLength(1);
	});

	it('loads the standard collection', async () => {
		await driver.loadCollection('@karuta/sanguosha-standard');

		const collections = Reflect.get(driver, 'collections');
		expect(collections).toHaveLength(1);

		const [col] = collections;
		const generals = col.getGenerals();
		expect(generals).toHaveLength(25);
	});

	it('creates generals', () => {
		const generals = driver.getGenerals();
		expect(generals).toHaveLength(25);
	});

	it('creates cards', () => {
		const cards = Reflect.apply(Reflect.get(driver, 'createCards'), driver, []) as Card[];
		expect(cards.length).toBeGreaterThan(0);
		expect(cards.every((card) => card.getId() > 0)).toBe(true);
	});

	it('finds a player', () => {
		const players = [
			{ getSeat() { return 2; } },
			{ getSeat() { return 1; } },
		];
		Reflect.set(driver, 'players', players);
		expect(driver.getPlayers()).toBe(players);
		expect(driver.findPlayer(2)).toBe(players[0]);
	});

	it('starts game', async () => {
		await driver.start();
		expect(room.broadcast).toBeCalledWith(Method.Post, Context.Game);
	});

	describe('#getDistance()', () => {
		const players = [
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 1; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 2; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 3; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 4; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 5; } },
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 6; } },
		] as Player[];

		it('refuses dead players', async () => {
			Reflect.set(driver, 'players', players);
			expect(Number.isFinite(await driver.getDistance(players[0], players[1]))).toBe(false);
			expect(Number.isFinite(await driver.getDistance(players[1], players[5]))).toBe(false);
			expect(Number.isFinite(driver.getDistance(players[0], players[5]))).toBe(false);
		});

		it('calculates shorter distance', async () => {
			Reflect.set(driver, 'players', players);
			const dist = await driver.getDistance(players[2], players[4]);
			expect(dist).toBe(2);
		});

		it('calculates shorter distance', async () => {
			Reflect.set(driver, 'players', players);
			const dist = await driver.getDistance(players[1], players[4]);
			expect(dist).toBe(1);
		});
	});

	describe('#isInAttackRange()', () => {
		it('checks attack range', async () => {
			const getDistance = jest.spyOn(driver, 'getDistance');

			getDistance.mockResolvedValue(2);
			const source = {
				getAttackRange() { return 2; },
			} as unknown as Player;
			expect(await driver.isInAttackRange(source, {} as unknown as Player)).toBe(true);
			getDistance.mockResolvedValue(3);
			expect(await driver.isInAttackRange(source, {} as unknown as Player)).toBe(false);

			getDistance.mockRestore();
		});
	});
});
