import { Room } from '@karuta/core';

import GameDriver from '../../src/driver/GameDriver';

const room = {} as unknown as Room;
const driver = new GameDriver(room);
const { recover } = driver;

it('recovers 1 HP', async () => {
	const to = {
		getMaxHp() { return 3; },
		getHp() { return 1; },
		setHp: jest.fn(),
		broadcastProperty: jest.fn(),
	};

	await Reflect.apply(recover, driver, [{
		to,
		num: 1,
	}]);

	expect(to.setHp).toBeCalledWith(2);
	expect(to.broadcastProperty).toBeCalledWith('hp', 2);
});

it('recovers no more than max HP', async () => {
	const to = {
		getMaxHp() { return 3; },
		getHp() { return 3; },
		setHp: jest.fn(),
		broadcastProperty: jest.fn(),
	};

	await Reflect.apply(recover, driver, [{
		to,
		num: 1,
	}]);

	expect(to.setHp).not.toBeCalled();
	expect(to.broadcastProperty).not.toBeCalled();
});

it('handles invalid structs', async () => {
	expect(await Reflect.apply(recover, driver, [{	num: 1 }])).toBe(false);
	expect(await Reflect.apply(recover, driver, [{	num: 0, to: {} }])).toBe(false);
});
