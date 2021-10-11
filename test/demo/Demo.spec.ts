import { Room } from '@karuta/core';

import ModeMap from '../../src/mode';
import GameDriver from '../../src/driver/GameDriver';
import { loader } from '../../src/driver/CollectionLoader';

import DemoPack from '.';
import MockUser from '../mock/User';

const getUsers = jest.fn();
const broadcast = jest.fn();
const room = {
	getUsers,
	broadcast,
} as unknown as Room;

const users = [
	new MockUser(room, 1, 'A'),
	new MockUser(room, 2, 'B'),
	new MockUser(room, 3, 'C'),
	new MockUser(room, 4, 'D'),
	new MockUser(room, 5, 'E'),
];
getUsers.mockReturnValue(users);

const driver = new GameDriver(room);

it('loads a demo pack', async () => {
	const get = jest.spyOn(loader, 'get').mockResolvedValue(DemoPack);
	await driver.loadCollection('@karuta/demo-pack');
	expect(get).toBeCalledWith('@karuta/demo-pack');
	get.mockRestore();
});

it('loads standard rules', async () => {
	const RuleClasses = ModeMap.get('standard');
	if (!RuleClasses) {
		throw new Error('Standard rules do not exist.');
	}
	for (const RuleClass of RuleClasses) {
		const rule = new RuleClass();
		rule.setIdle(0);
		driver.register(rule);
	}
});

it('creates generals', () => {
	const generals = driver.getGenerals();
	expect(generals).toHaveLength(8);
});

it('starts the game', async () => {
	const patch = users.map((user) => jest.spyOn(user, 'patch').mockResolvedValue(undefined));
	const notify = users.map((user) => jest.spyOn(user, 'notify').mockReturnValue());
	await driver.start();
	for (let i = 0; i < users.length; i++) {
		expect(patch[i]).toBeCalledTimes(1);
		expect(notify[i]).toBeCalledTimes(5);
	}
	driver.stop();
});

it('arranges cards for each player', () => {
	const players = driver.getPlayers();
	expect(players).toHaveLength(5);
	for (const player of players) {
		const area = player.getHandArea();
		expect(area.size).toBeGreaterThan(3);
	}
});

it('finds a player', () => {
	const p2 = driver.findPlayer(2);
	expect(p2?.getSeat()).toBe(2);
	expect(driver.getPlayers()).toContain(p2);
});

describe('#getDistance()', () => {
	beforeAll(() => {
		driver.findPlayer(1)?.setDead(true);
		driver.findPlayer(5)?.setDead(true);
	});

	afterAll(() => {
		driver.findPlayer(1)?.setDead(false);
		driver.findPlayer(5)?.setDead(false);
	});

	it('refuses dead players', async () => {
		const players = driver.getPlayers();
		players[0].setDead(true);
		players[4].setDead(true);

		expect(await driver.getDistance(players[0], players[1])).toBe(Infinity);
		expect(await driver.getDistance(players[1], players[4])).toBe(Infinity);
		expect(await driver.getDistance(players[0], players[4])).toBe(Infinity);
	});

	it('calculates shorter distance', async () => {
		const p2 = driver.findPlayer(2);
		const p4 = driver.findPlayer(4);
		const dist = await driver.getDistance(p2, p4);
		expect(dist).toBe(1);
	});
});

describe('#isInAttackRange()', () => {
	it('checks attack range', async () => {
		const getDistance = jest.spyOn(driver, 'getDistance');

		getDistance.mockResolvedValue(2);

		const p1 = driver.findPlayer(1);
		p1.setAttackRange(2);

		const p2 = driver.findPlayer(3);

		expect(await driver.isInAttackRange(p1, p2)).toBe(true);
		getDistance.mockResolvedValue(3);
		expect(await driver.isInAttackRange(p1, p2)).toBe(false);

		getDistance.mockRestore();
	});
});
