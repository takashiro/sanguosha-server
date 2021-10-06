import { PlayerPhase as Phase } from '@karuta/sanguosha-core';
import {
	Player,
	GameDriver,
	PhaseChange,
} from '@karuta/sanguosha-pack';

import PhaseRule from '../../../src/mode/basic/PhaseRule';

describe('Phase Rule', () => {
	const rule = new PhaseRule();

	it('checks driver and target', () => {
		rule.setDriver();
		expect(rule.isTriggerable(null as unknown as PhaseChange)).toBe(false);
		expect(Reflect.apply(rule.isTriggerable, rule, [{}])).toBe(false);

		Reflect.apply(rule.setDriver, rule, [{}]);
		expect(rule.isTriggerable(null as unknown as PhaseChange)).toBe(false);
		expect(rule.isTriggerable({ player: 1 } as unknown as PhaseChange)).toBe(true);
	});

	it('draws 2 cards', async () => {
		const player = {} as unknown as Player;
		const driver = {
			trigger(): void {
				// do nothing
			},
			drawCards: jest.fn(),
		} as unknown as GameDriver;
		rule.setDriver(driver);

		await rule.process({
			to: Phase.Draw,
			player,
		} as unknown as PhaseChange);

		expect(driver.drawCards).toBeCalledWith(player, 2);
	});

	it('activates a player', async () => {
		const play = jest.fn().mockResolvedValue(false);
		for (let i = 0; i < 2; i++) {
			play.mockResolvedValueOnce(true);
		}

		const handArea = {
			getCards() {
				return [];
			},
		};

		const setUseLimit = jest.fn();
		const clearUseCount = jest.fn();
		const clearUseLimit = jest.fn();

		const player = {
			play,
			getHandArea() {
				return handArea;
			},
			setUseLimit,
			clearUseCount,
			clearUseLimit,
		};

		await rule.process({
			to: Phase.Play,
			player,
		} as unknown as PhaseChange);

		expect(play).toBeCalledTimes(3);
		expect(setUseLimit).toBeCalledWith('strike', 1);
		expect(clearUseCount).toBeCalledTimes(1);
		expect(clearUseLimit).toBeCalledTimes(1);
	});

	it('discards overflow hand cards', async () => {
		const handArea = {
			size: 10,
		};
		const selected = [1, 2, 3];
		const player = {
			getHandArea: jest.fn().mockReturnValue(handArea),
			getHp() {
				return 3;
			},
			askForCards: jest.fn().mockResolvedValue(selected),
		};
		const discardPile = {};
		const driver = {
			getDiscardPile: () => discardPile,
			trigger: jest.fn(),
			moveCards: jest.fn(),
		} as unknown as GameDriver;
		rule.setDriver(driver);

		await rule.process({
			player,
			to: Phase.Discard,
		} as unknown as PhaseChange);

		expect(driver.moveCards).toBeCalledWith(selected, discardPile, { open: true });
	});

	it('does nothing by default', async () => {
		await rule.process({} as unknown as PhaseChange);
	});
});
