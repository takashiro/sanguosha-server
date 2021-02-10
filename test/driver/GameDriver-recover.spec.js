import GameDriver from '../../src/driver/GameDriver';

const room = {};
const driver = new GameDriver(room);

it('recovers 1 HP', async () => {
	const to = {
		getMaxHp() { return 3; },
		getHp() { return 1; },
		setHp: jest.fn(),
		broadcastProperty: jest.fn(),
	};

	await driver.recover({
		to,
		num: 1,
	});

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

	await driver.recover({
		to,
		num: 1,
	});

	expect(to.setHp).not.toBeCalled();
	expect(to.broadcastProperty).not.toBeCalled();
});

it('handles invalid structs', async () => {
	expect(await driver.recover({	num: 1 })).toBe(false);
	expect(await driver.recover({	num: 0, to: {} })).toBe(false);
});
