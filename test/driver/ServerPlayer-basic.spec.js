import {
	CardArea,
	CardAreaType,
} from '@karuta/sanguosha-core';

import ServerPlayer from '../../src/driver/ServerPlayer';

describe('ServerPlayer', () => {
	const player = new ServerPlayer();

	it('has user id', () => {
		expect(player.getId()).toBe(0);
		player.user = {
			getId() {
				return 123;
			},
		};
		expect(player.getId()).toBe(123);
	});

	it('has hand-card area', () => {
		const area = player.getHandArea();
		expect(area).toBeInstanceOf(CardArea);
		expect(CardAreaType.Hand).toBeTruthy();
		expect(area.getType()).toBe(CardAreaType.Hand);
	});

	it('has equip area', () => {
		const area = player.getEquipArea();
		expect(area).toBeInstanceOf(CardArea);
		expect(CardAreaType.Equip).toBeTruthy();
		expect(area.getType()).toBe(CardAreaType.Equip);
	});

	it('has judge area', () => {
		const area = player.getJudgeArea();
		expect(area).toBeInstanceOf(CardArea);
		expect(CardAreaType.Judge).toBeTruthy();
		expect(area.getType()).toBe(CardAreaType.Judge);
	});

	it('has process area', () => {
		const area = player.getProcessArea();
		expect(area).toBeInstanceOf(CardArea);
		expect(CardAreaType.Process).toBeTruthy();
		expect(area.getType()).toBe(CardAreaType.Process);
	});

	it('has request timeout', () => {
		const timeout = Math.floor(Math.random() * 0xFFFF);
		player.setRequestTimeout(timeout);
		expect(player.getRequestTimeout()).toEqual(timeout);
	});

	it('generates null reply if no user is connected', async () => {
		player.user = null;
		expect(await player.request()).toBeNull();
	});
});
