import { Room, User } from '@karuta/core';

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
});
