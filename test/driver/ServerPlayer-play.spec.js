import {
	Command as cmd,
} from '@karuta/sanguosha-core';

import ServerPlayer from '../../src/driver/ServerPlayer';

describe('ServerPlayer: Play Cards', () => {
	const user = {};
	const player = new ServerPlayer(user);

	it('records use counts of cards', () => {
		expect(player.getUseCount('strike')).toBe(0);

		player.addUseCount('strike', 1);
		player.addUseCount('strike', 2);
		player.addUseCount('jink', 1);
		expect(player.getUseCount('strike')).toBe(3);

		player.resetUseCount('jink');
		expect(player.getUseCount('jink')).toBe(0);

		player.clearUseCount();
		expect(player.getUseCount('strike')).toBe(0);
		expect(player.getUseCount('jink')).toBe(0);
	});

	it('sets use limit of cards', () => {
		expect(player.getUseLimit('strike')).toBe(Infinity);
		player.setUseLimit('strike', 1);
		expect(player.getUseLimit('strike')).toBe(1);
		player.clearUseLimit();
		expect(player.getUseLimit('strike')).toBe(Infinity);
	});

	describe('#play()', () => {
		const card1 = {
			getId() {
				return 1;
			},
		};
		const card2 = {
			getId() {
				return 2;
			},
		};

		const availableCards = [card1, card2];
		const cards = [card1.getId(), card2.getId()];
		const requestTimeout = player.getRequestTimeout();

		const handArea = player.getHandArea();
		handArea.add(card1);
		handArea.add(card2);

		const request = jest.fn();
		user.request = request;
		beforeEach(() => {
			request.mockClear();
		});

		it('handles timeout error', async () => {
			request.mockImplementation(() => {
				throw new Error('timeout');
			});

			const res = await player.play(availableCards);
			expect(res).toBeNull();
			expect(request).toBeCalledWith(cmd.Play, { cards }, requestTimeout);
		});

		it('handles invalid card id from user response', async function () {
			request.mockReturnValue(null);
			expect(await player.play(availableCards)).toBeNull();

			request.mockReturnValue({ cards: [] });
			expect(await player.play(availableCards)).toBeNull();

			request.mockReturnValue({ cards: ['test', 'wer'] });
			expect(await player.play(availableCards)).toBeNull();

			request.mockReturnValue({ cards: [3] });
			expect(await player.play(availableCards)).toBeNull();
		});

		it('plays a card', async () => {
			const driver = {
				useCard: jest.fn(),
			};
			user.getDriver = jest.fn().mockReturnValue(driver);
			request.mockResolvedValue({ cards: [card1.getId()] });

			const action = await player.play(availableCards);
			expect(action).toBeTruthy();
		});
	});
});
