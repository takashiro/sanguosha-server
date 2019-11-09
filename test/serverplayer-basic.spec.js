
const assert = require('assert');

const ServerPlayer = require('../src/driver/ServerPlayer');
const CardAreaType = require('../src/core/CardArea/Type');

describe('ServerPlayer', function () {
	const player = new ServerPlayer();

	it('has user id', function () {
		assert(player.getId() === 0);
		player.user = { id: 123 };
		assert(player.getId() === 123);
	});

	it('has hand-card area', function () {
		assert(player.handArea);
		assert(CardAreaType.Hand);
		assert(player.handArea.type === CardAreaType.Hand);
	});

	it('has equip area', function () {
		assert(player.equipArea);
		assert(CardAreaType.Equip);
		assert(player.equipArea.type === CardAreaType.Equip);
	});

	it('has delayed-trick area', function () {
		assert(player.delayedTrickArea);
		assert(CardAreaType.DelayedTrick);
		assert(player.delayedTrickArea.type === CardAreaType.DelayedTrick);
	});

	it('has process area', function () {
		assert(player.processArea);
		assert(CardAreaType.Process);
		assert(player.processArea.type === CardAreaType.Process);
	});

	it('has request timeout', function () {
		const timeout = Math.floor(Math.random() * 0xFFFF);
		player.setRequestTimeout(timeout);
		assert.strictEqual(player.getRequestTimeout(), timeout);
	});

	it('generates null reply if no user is connected', function () {
		player.user = null;
		assert.strictEqual(player.request(), null);
	});
});
