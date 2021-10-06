import { User } from '@karuta/core';
import { GameDriver } from '@karuta/sanguosha-pack';

import Game from '../../src/cmd/Game';

const register = jest.fn();
const start = jest.fn();
const driver = {
	register,
	start,
} as unknown as GameDriver;

const user = {} as unknown as User;

const handler = new Game(driver, user);

it('starts the game', async () => {
	await handler.put();
	expect(register).toBeCalled();
	expect(start).toBeCalledTimes(1);
});

it('can handle unknown game mode', async () => {
	register.mockClear();
	start.mockClear();

	await handler.put({ mode: 'custom' });

	expect(register).not.toBeCalled();
	expect(start).toBeCalledTimes(1);
});
