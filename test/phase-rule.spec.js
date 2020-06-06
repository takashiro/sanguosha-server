import { PlayerPhase as Phase } from '@karuta/sanguosha-core';
import PhaseRule from '../src/mode/basic/PhaseRule';

describe('Phase Rule', () => {
	const rule = new PhaseRule();

	it('checks driver and target', () => {
		rule.setDriver(null);
		expect(rule.isTriggerable(null)).toBe(false);
		expect(rule.isTriggerable({})).toBe(false);

		rule.setDriver({});
		expect(rule.isTriggerable(null)).toBe(false);
		expect(rule.isTriggerable({ player: 1 })).toBe(true);
	});

	it('draws 2 cards', async () => {
		const player = {};
		const driver = {
			trigger() {},
			drawCards: jest.fn(),
		};
		rule.setDriver(driver);

		await rule.process({
			to: Phase.Draw,
			player,
		});

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
		});

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
		};
		rule.setDriver(driver);

		await rule.process({
			player,
			to: Phase.Discard,
		});

		expect(driver.moveCards).toBeCalledWith(selected, discardPile, { open: true });
	});

	it('does nothing by default', async () => {
		await rule.process({}, {});
	});
});
