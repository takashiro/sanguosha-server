import GameDriver from '../src/driver/GameDriver';
import ServerPlayer from '../src/driver/ServerPlayer';

describe('GameDriver', () => {
	const driver = new GameDriver();
	driver.players = [
		new ServerPlayer(),
		new ServerPlayer(),
		new ServerPlayer(),
		new ServerPlayer(),
	];
	for (let i = 1; i <= 4; i++) {
		driver.players[i - 1].setSeat(i);
	}

	const useCard = jest.spyOn(driver, 'useCard');

	const request = jest.fn();
	const user = {
		request,
	};
	const player = new ServerPlayer(user);

	describe('#playCard()', () => {
		const fakeCard = {
			isAvailable() { return true; },
			filterPlayer: jest.fn(),
			isFeasible: jest.fn(),
		};

		const someCard = {
			isAvailable() { return true; },
			isFeasible() { return true; },
			filterPlayer() { return true; },
		};

		it('should reject unavailable cards', async () => {
			const card = {
				isAvailable: jest.fn().mockReturnValue(false),
			};
			expect(await driver.playCard(player, card)).toBe(false);
			expect(card.isAvailable).toBeCalledWith(driver, player);
		});

		it('should handle timeout error', async () => {
			request.mockImplementation(() => {
				throw new Error('timeout');
			});
			expect(await driver.playCard(player, fakeCard)).toBe(false);
		});

		it('should handle cancel command', async () => {
			request.mockResolvedValue({ cancel: true });
			expect(await driver.playCard(player, fakeCard)).toBe(true);
			request.mockResolvedValue(null);
			expect(await driver.playCard(player, fakeCard)).toBe(true);
		});

		it('should handle non-existing player', async function () {
			request.mockResolvedValue({ player: 100 });
			expect(await driver.playCard(player, fakeCard)).toBe(false);
		});

		it('should reject invalid card targets', async () => {
			const card = {
				isAvailable() { return true; },
				isFeasible(selected) {
					return selected.length === 1;
				},
				filterPlayer(selected, target) {
					return selected.length === 0 && target !== null;
				},
			};

			request.mockResolvedValue(null)
				.mockResolvedValueOnce({ player: 1, selected: false })
				.mockRejectedValueOnce({ player: 1, selected: true })
				.mockRejectedValueOnce({ player: 1, selected: true });

			expect(await driver.playCard(player, card)).toBe(false);
		});

		it('should stop if no confirm or selection command is received', async () => {
			request.mockResolvedValue({});
			expect(await driver.playCard(player, someCard)).toBe(false);
		});

		it('should stop if targets are not feasible', async () => {
			const card = {
				isAvailable() { return true; },
				isFeasible() { return false; },
				filterPlayer() { return true; },
			};

			request.mockResolvedValue({ confirm: true });
			expect(await driver.playCard(player, card)).toBe(false);
		});

		it('should handle duplicate add or removal', async () => {
			useCard.mockResolvedValue();
			request.mockResolvedValue(null)
				.mockResolvedValueOnce({ player: 1, selected: true })
				.mockResolvedValueOnce({ player: 1, selected: true })
				.mockResolvedValueOnce({ player: 2, selected: true })
				.mockResolvedValueOnce({ player: 2, selected: false })
				.mockResolvedValueOnce({ player: 2, selected: false })
				.mockResolvedValueOnce({ confirm: true });

			expect(await driver.playCard(player, someCard)).toBe(true);
			const [use] = useCard.mock.calls[0];
			expect(use.to).toHaveLength(1);
			expect(use.from).toBe(player);
			expect(use.to[0]).toBe(driver.players[0]);
			expect(use.card).toBe(someCard);
		});
	});
});
