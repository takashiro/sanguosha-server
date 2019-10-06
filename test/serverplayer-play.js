const assert = require('assert');

const ServerPlayer = require('../driver/ServerPlayer');

describe('ServerPlayer', function () {
	const user = {};
	const player = new ServerPlayer(user);

	it('records use counts of cards', function () {
		assert(player.getUseCount('strike') === 0);

		player.addUseCount('strike', 1);
		player.addUseCount('strike', 2);
		player.addUseCount('jink', 1);
		assert(player.getUseCount('strike') === 3);

		player.resetUseCount('jink');
		assert(player.getUseCount('jink') === 0);

		player.clearUseCount();
		assert(player.getUseCount('strike') === 0);
		assert(player.getUseCount('jink') === 0);
	});
});
