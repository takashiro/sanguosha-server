import {
	CardSuit as Suit,
} from '@karuta/sanguosha-core';

import BorrowSword from '../../../src/collection/standard/trick/BorrowSword';
import WeaponCard from '../../../src/base/WeaponCard';
import ArmorCard from '../../../src/base/ArmorCard';

const card = new BorrowSword(Suit.Club, 2);
const driver = {
	moveCards: jest.fn(),
	useCard: jest.fn(),
	isInAttackRange: jest.fn().mockResolvedValue(false),
};

describe('#targetFeasible()', () => {
	it('accepts 2 players', async () => {
		expect(await card.isFeasible(driver, [])).toBe(false);
		expect(await card.isFeasible(driver, [1])).toBe(false);
		expect(await card.isFeasible(driver, [1, 2])).toBe(true);
	});
});

describe('#targetFilter()', () => {
	const self = {};
	const target1 = {
		getEquipArea: () => ([
			new WeaponCard(Suit.Spade, 1),
		]),
	};
	const target2 = {
		getEquipArea: () => ([
			new ArmorCard(Suit.Spade, 1),
		]),
	};

	it('can be used to others only', async () => {
		const selected = [];
		expect(await card.filterPlayer(driver, selected, self, self)).toBe(false);
		expect(await card.filterPlayer(driver, selected, target1, self)).toBe(true);
		expect(await card.filterPlayer(driver, selected, target2, self)).toBe(false);
	});

	it('requires an extra victim target', async () => {
		const selected = [1];

		expect(await card.filterPlayer(driver, selected, target1, self)).toBe(false);
		expect(driver.isInAttackRange).toBeCalledWith(selected[0], target1);

		driver.isInAttackRange.mockResolvedValueOnce(true);
		expect(await card.filterPlayer(driver, selected, target2, self)).toBe(true);
		expect(driver.isInAttackRange).toBeCalledWith(selected[0], target2);
	});

	it('requires <= 2 players', async () => {
		const selected = [1, 2];
		expect(await card.filterPlayer(driver, selected, self, {})).toBe(false);
	});
});

describe('#onUse()', () => {
	const use = {
		to: [1, 2],
	};

	it('remove victim from target list', async () => {
		await card.onUse(driver, use);
		expect(use.to).toHaveLength(1);
		expect(use.to[0]).toBe(1);
		expect(card.victim).toBe(2);
	});

	it('avoid double removal', async () => {
		await card.onUse(driver, use);
		expect(use.to).toEqual([1]);
	});
});

describe('#effect()', () => {
	const weapon = new WeaponCard('test', Suit.Club, 3);
	const armor = new ArmorCard('a', Suit.Diamond, 1);
	const equipArea = [
		armor,
	];
	const to = {
		getHandArea: jest.fn(),
		getEquipArea: jest.fn().mockReturnValue(equipArea),
		isDead: jest.fn().mockReturnValue(false),
		askForCards: jest.fn().mockResolvedValue([]),
	};

	const handArea = {};
	const from = {
		isAlive: jest.fn().mockReturnValue(true),
		getHandArea: jest.fn().mockReturnValue(handArea),
	};
	const effect = {
		from,
		to,
	};

	it('do nothing if target is undefined', async () => {
		await card.effect(driver, {});
	});

	it('do nothing if target is dead', async () => {
		to.isDead.mockReturnValueOnce(true);
		await card.effect(driver, { to });
		expect(to.isDead).toBeCalled();
	});

	it('moves nothing if weapon is gone', async () => {
		await card.effect(driver, effect);
		expect(driver.moveCards).not.toBeCalled();
	});

	it('moves weapon card if no strike is provided', async () => {
		card.victim = 'victim';
		equipArea.push(weapon);
		await card.effect(driver, effect);
		expect(driver.moveCards).toBeCalledWith([weapon], handArea, { open: true });
		driver.moveCards.mockClear();
	});

	it('performs a strike if provided', async () => {
		card.victim = 'victim';
		to.askForCards.mockResolvedValue([777]);
		await card.effect(driver, effect);
		expect(driver.moveCards).not.toBeCalled();
		expect(driver.useCard).toBeCalledWith({
			from: to,
			to: ['victim'],
			card: 777,
		});
	});
});
