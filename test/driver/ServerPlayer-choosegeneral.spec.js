import {
	Context,
	General,
} from '@karuta/sanguosha-core';

import ServerPlayer from '../../src/driver/ServerPlayer';

describe('ServerPlayer: Choose Generals', () => {
	const generals = [];
	for (let i = 0; i < 10; i++) {
		const kingdom = (i % 4) + 1;
		const gender = (i % 2) + 1;
		const general = new General(`general${i}`, kingdom, 4, gender);
		generals.push(general);
	}

	const metaGenerals = generals.map((general, id) => ({ ...general.toJSON(), id }));

	const user = {
		id: 1,
		get: jest.fn(),
	};

	const player = new ServerPlayer(user);

	afterEach(() => {
		user.get.mockClear();
	});

	it('asks for 1 general', async () => {
		const chosen = await player.askForGeneral(generals);

		expect(chosen).toHaveLength(1);
		expect(generals).toContain(chosen[0]);
		expect(user.get).toBeCalledWith(Context.General, {
			generals: metaGenerals,
			num: 1,
			sameKingdom: false,
		});
	});

	it('asks for 2 generals', async () => {
		const chosen = await player.askForGeneral(generals);

		expect(chosen).toHaveLength(1);
		for (const general of chosen) {
			expect(generals).toContain(general);
		}

		expect(user.get).toBeCalledTimes(1);
		expect(user.get).toBeCalledWith(Context.General, {
			generals: metaGenerals,
			num: 1,
			sameKingdom: false,
		});
	});

	it('asks for 1 general (not required)', async () => {
		const chosen = await player.askForGeneral(generals, { forced: false });

		expect(chosen).toHaveLength(0);
		expect(user.get).toBeCalledTimes(1);
		expect(user.get).toBeCalledWith(Context.General, {
			generals: metaGenerals,
			num: 1,
			sameKingdom: false,
		});
	});
});
