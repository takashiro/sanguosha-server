
const assert = require('assert');
const ServerPlayer = require('../driver/ServerPlayer');

const cmd = require('../cmd');
const General = require('../core/General');

describe('ServerPlayer - Choose General', function () {
	const generals = [];
	for (let i = 0; i < 10; i++) {
		const kingdom = (i % 4) + 1;
		const gender = (i % 2) + 1;
		const general = new General(`general${i}`, kingdom, 4, gender);
		generals.push(general);
	}

	const user = {
		id: 1,

		async request(command, args) {
			assert(command === cmd.ChooseGeneral);
		},
	};

	const player = new ServerPlayer(user);

	it('asks for 1 general', async function () {
		const chosen = await player.askForGeneral(generals);
		assert(chosen.length === 1);
		assert(generals.indexOf(chosen[0]) >= 0);
	});

	it('asks for 2 generals', async function () {
		const chosen = await player.askForGeneral(generals);
		assert(chosen.length === 1);
		for (const general of chosen) {
			assert(generals.indexOf(general) >= 0);
		}
	});

	it('asks for 1 general (not required)', async function () {
		const chosen = await player.askForGeneral(generals, { forced: false });
		assert(chosen.length === 0);
	});
});
