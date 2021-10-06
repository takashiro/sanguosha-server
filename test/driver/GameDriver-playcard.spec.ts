import { Room, User } from '@karuta/core';
import { ReplyType } from '@karuta/sanguosha-core';
import { Card, Player } from '@karuta/sanguosha-pack';

import GameDriver from '../../src/driver/GameDriver';
import ServerPlayer from '../../src/driver/ServerPlayer';

describe('GameDriver', () => {
	const room = {} as unknown as Room;
	const driver = new GameDriver(room);
	const players: ServerPlayer[] = new Array(4);
	for (let i = 1; i <= 4; i++) {
		const player = new ServerPlayer({} as unknown as User);
		player.setSeat(i);
		players[i - 1] = player;
	}
	driver.setPlayers(players);

	const useCard = jest.spyOn(driver, 'useCard');

	const get = jest.fn();
	const user = {
		get,
	} as unknown as User;
	const player = new ServerPlayer(user);

	describe('#playCard()', () => {
		const fakeCard = {
			isAvailable() { return true; },
			filterPlayer: jest.fn(),
			isFeasible: jest.fn(),
		} as unknown as Card;

		const someCard = {
			isAvailable() { return true; },
			isFeasible() { return true; },
			filterPlayer() { return true; },
		} as unknown as Card;

		it('should reject unavailable cards', async () => {
			const isAvailable = jest.fn().mockReturnValue(false);
			const card = {
				isAvailable,
			} as unknown as Card;
			expect(await driver.playCard(player, card)).toBe(false);
			expect(isAvailable).toBeCalledWith(driver, player);
		});

		it('should handle timeout error', async () => {
			get.mockImplementation(() => {
				throw new Error('timeout');
			});
			expect(await driver.playCard(player, fakeCard)).toBe(false);
		});

		it('should handle cancel command', async () => {
			get.mockResolvedValue({ type: ReplyType.Cancel });
			expect(await driver.playCard(player, fakeCard)).toBe(true);
			get.mockResolvedValue(null);
			expect(await driver.playCard(player, fakeCard)).toBe(true);
		});

		it('should handle non-existing player', async function () {
			get.mockResolvedValue({ data: [100] });
			expect(await driver.playCard(player, fakeCard)).toBe(false);
		});

		it('should reject invalid card targets', async () => {
			const card = {
				isAvailable() { return true; },
				isFeasible(selected: Player[]): boolean {
					return selected.length === 1;
				},
				filterPlayer(selected: Player[], target: Player): boolean {
					return selected.length === 0 && target !== null;
				},
			} as unknown as Card;

			get.mockResolvedValue(null)
				.mockResolvedValueOnce({ player: 1 })
				.mockRejectedValueOnce({ player: 1 });

			expect(await driver.playCard(player, card)).toBe(false);
		});

		it('should stop if no confirm or selection command is received', async () => {
			get.mockResolvedValue({});
			expect(await driver.playCard(player, someCard)).toBe(false);
		});

		it('should stop if targets are not feasible', async () => {
			const card = {
				isAvailable() { return true; },
				isFeasible() { return false; },
				filterPlayer() { return true; },
			} as unknown as Card;

			get.mockResolvedValue({ type: ReplyType.Confirm });
			expect(await driver.playCard(player, card)).toBe(false);
		});

		it('should use a card', async () => {
			useCard.mockResolvedValue(false);
			get.mockResolvedValueOnce({ data: [1] })
				.mockResolvedValueOnce({ type: ReplyType.Confirm });

			expect(await driver.playCard(player, someCard)).toBe(true);
			const [use] = useCard.mock.calls[0];
			expect(use.to).toHaveLength(1);
			expect(use.from).toBe(player);
			expect(use.to[0]).toBe(players[0]);
			expect(use.card).toBe(someCard);
		});
	});
});
