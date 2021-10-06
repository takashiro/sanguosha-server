import {
	Context,
	PlayerRole as Role,
} from '@karuta/sanguosha-core';

import { EventType as GameEvent } from '@karuta/sanguosha-pack';

import GameDriver from '../../../src/driver';

import StandardRule from '../../../src/mode/standard/StandardRule';

function countArray(arr, condition) {
	let count = 0;
	for (const a of arr) {
		if (condition(a)) {
			count++;
		}
	}
	return count;
}

describe('StandardRule', () => {
	const users = [];

	const room = {
		broadcast() {},
		broadcastExcept() {},
		getUsers() { return users; },
	};

	const driver = new GameDriver(room);

	const candidateDuplicates = [];

	function patch(command, args) {
		if (command === Context.General) {
			candidateDuplicates.push(...args.generals.map((general) => general.name));
			return Math.floor(Math.random() * args.generals.length);
		}
		if (command === Context.CardMove) {
			console.log(args);
		}
		return null;
	}
	const notify = jest.fn();

	for (let i = 1; i <= 8; i++) {
		users.push({
			getId() { return i; },
			getName() { return `user${i}`; },
			getRoom() { return room; },
			notify,
			patch,
		});
	}

	const rule = new StandardRule();
	rule.setDriver(driver);

	it('binds to start event', () => {
		expect(rule.event).toBe(GameEvent.StartingGame);
	});

	describe('#preparePlayers()', () => {
		it('prepares players', () => {
			rule.preparePlayers();
		});
	});

	describe('#prepareRules()', () => {
		it('prepares roles', () => {
			rule.prepareRoles();

			const { players } = driver;
			expect(players[0].getRole()).toBe(Role.Emperor);

			const rebelNum = countArray(players, (player) => player.getRole() === Role.Rebel);
			expect(rebelNum).toBe(4);

			const emperorNum = countArray(players, (player) => player.getRole() === Role.Emperor);
			expect(emperorNum).toBe(1);

			const renegadeNum = countArray(players, (player) => player.getRole() === Role.Renegade);
			expect(renegadeNum).toBe(1);

			const loyalistNum = countArray(players, (player) => player.getRole() === Role.Loyalist);
			expect(loyalistNum).toBe(2);
		});
	});

	describe('#prepareSeats()', () => {
		it('prepares seats', () => {
			rule.prepareSeats();

			const seats = [];
			for (const player of driver.players) {
				seats.push(player.getSeat());
				expect(player.getSeat()).toBeGreaterThan(0);
			}

			seats.sort();
			for (let i = 0; i < seats.length; i++) {
				expect(seats[i]).toBe(i + 1);
			}
		});
	});

	describe('#prepareGenerals()', () => {
		it('prepares generals', async () => {
			await rule.prepareGenerals();
			for (const player of driver.players) {
				const general = player.getGeneral();
				expect(general).toBeTruthy();
			}
		});
	});

	it('checks candidate duplicates', () => {
		candidateDuplicates.splice(0, 5);
		for (let i = 0; i < candidateDuplicates.length; i++) {
			const name = candidateDuplicates[i];
			for (let j = i + 1; j < candidateDuplicates.length; j++) {
				expect(candidateDuplicates[j]).not.toBe(name);
			}
		}
	});

	describe('#prepareCards()', () => {
		it('prepares cards', async () => {
			await rule.prepareCards();

			for (const player of driver.players) {
				expect(player.getHandArea().size).toBe(4);
			}
		});
	});

	it('handles invalid values', async () => {
		driver.users = [];
		driver.players = [];
		await rule.prepareRoles();
		await rule.process();
	});
});
