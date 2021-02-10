import { EventType as GameEvent } from '@karuta/sanguosha-pack';

import GameDriver from '../../src/driver';

describe('GameDriver', () => {
	const room = {
		broadcast: jest.fn(),
	};
	const driver = new GameDriver(room);

	it('loads the standard collection', async () => {
		await driver.loadCollection('@karuta/sanguosha-standard');
		expect(driver.collections).toHaveLength(1);

		const [col] = driver.collections;
		const generals = col.getGenerals();
		expect(generals).toHaveLength(25);
	});

	it('creates generals', () => {
		const generals = driver.getGenerals();
		expect(generals).toHaveLength(25);
	});

	it('creates cards', () => {
		const cards = driver.createCards();
		expect(cards.length).toBeGreaterThan(0);
		expect(cards.every((card) => card.getId() > 0)).toBe(true);
	});

	it('finds a player', () => {
		driver.players = [
			{ getSeat() { return 2; } },
			{ getSeat() { return 1; } },
		];
		expect(driver.getPlayers()).toBe(driver.players);
		expect(driver.findPlayer(2)).toBe(driver.players[0]);
	});

	it('starts game', async () => {
		await driver.start();
		expect(room.broadcast).toBeCalledWith(GameEvent.StartingGame);
	});

	describe('#getDistance()', () => {
		const players = [
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 1; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 2; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 3; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 4; } },
			{ isDead() { return false; }, isAlive() { return true; }, getSeat() { return 5; } },
			{ isDead() { return true; }, isAlive() { return false; }, getSeat() { return 6; } },
		];

		it('refuses dead players', async () => {
			driver.players = players;
			expect(Number.isFinite(await driver.getDistance(players[0], players[1]))).toBe(false);
			expect(Number.isFinite(await driver.getDistance(players[1], players[5]))).toBe(false);
			expect(Number.isFinite(driver.getDistance(players[0], players[5]))).toBe(false);
		});

		it('calculates shorter distance', async () => {
			driver.players = players;
			const dist = await driver.getDistance(players[2], players[4]);
			expect(dist).toBe(2);
		});

		it('calculates shorter distance', async () => {
			driver.players = players;
			const dist = await driver.getDistance(players[1], players[4]);
			expect(dist).toBe(1);
		});
	});

	describe('#isInAttackRange()', () => {
		it('checks attack range', async () => {
			const getDistance = jest.spyOn(driver, 'getDistance');

			getDistance.mockReturnValue(2);
			const source = {
				getAttackRange() { return 2; },
			};
			expect(await driver.isInAttackRange(source, {})).toBe(true);
			getDistance.mockReturnValue(3);
			expect(await driver.isInAttackRange(source, {})).toBe(false);

			getDistance.mockRestore();
		});
	});
});
