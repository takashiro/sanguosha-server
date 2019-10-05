const assert = require('assert');
const sinon = require('sinon');

const ServerPlayer = require('../driver/ServerPlayer');

const cmd = require('../cmd');
const General = require('../core/General');

describe('ServerPlayer#askForGeneral()', function () {
	const generals = [];
	for (let i = 0; i < 10; i++) {
		const kingdom = (i % 4) + 1;
		const gender = (i % 2) + 1;
		const general = new General(`general${i}`, kingdom, 4, gender);
		generals.push(general);
	}

	const user = {
		id: 1,
		request: sinon.spy(),
	};

	const player = new ServerPlayer(user);

	this.afterEach(function () {
		user.request.resetHistory();
	});

	it('asks for 1 general', async function () {
		const chosen = await player.askForGeneral(generals);

		assert(chosen.length === 1);
		assert(generals.includes(chosen[0]));
		assert(user.request.calledOnceWith(cmd.ChooseGeneral));
	});

	it('asks for 2 generals', async function () {
		const chosen = await player.askForGeneral(generals);

		assert(chosen.length === 1);
		for (const general of chosen) {
			assert(generals.includes(general));
		}
		assert(user.request.calledOnceWith(cmd.ChooseGeneral));
	});

	it('asks for 1 general (not required)', async function () {
		const chosen = await player.askForGeneral(generals, { forced: false });

		assert(chosen.length === 0);
		assert(user.request.calledOnceWith(cmd.ChooseGeneral));
	});
});
