import PhaseRule from '../src/mode/basic/PhaseRule';
import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

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

		await rule.effect({
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

		const player = {
			play,
			getHandArea() {
				return handArea;
			},
		};

		await rule.effect({
			to: Phase.Play,
			player,
		});

		expect(play).toBeCalledTimes(3);
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

		await rule.effect({
			player,
			to: Phase.Discard,
		});

		expect(driver.moveCards).toBeCalledWith(selected, handArea, discardPile, { open: true });
	});

	it('does nothing by default', async () => {
		await rule.effect({}, {});
	});
});
