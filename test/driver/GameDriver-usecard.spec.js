import { Method } from '@karuta/core';
import { Context } from '@karuta/sanguosha-core';

import {
	Card,
	CardUse,
} from '@karuta/sanguosha-pack';

import Player from '../../src/driver/ServerPlayer';
import GameDriver from '../../src/driver';

describe('GameDriver: Use a Card', () => {
	const room = {
		broadcast: jest.fn(),
	};
	const driver = new GameDriver(room);

	it('accepts invalid parameter', async () => {
		const use = new CardUse();
		expect(await driver.useCard(use)).toBe(false);
	});

	it('proceed card effects', async () => {
		const card = new Card();
		card.onUse = jest.fn();
		card.use = jest.fn();

		const use = new CardUse(new Player(), card);
		await driver.useCard(use);

		expect(card.onUse).toBeCalledWith(driver, use);
		expect(room.broadcast).toBeCalledWith(Method.Post, Context.CardUse, use.toJSON());
		expect(card.use).toBeCalledWith(driver, use);
	});
});
