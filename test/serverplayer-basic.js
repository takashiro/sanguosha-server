
const assert = require('assert');
const ServerPlayer = require('../driver/ServerPlayer');

const CardAreaType = require('../core/CardArea/Type');

describe('ServerPlayer', function () {
	const player = new ServerPlayer();

	it('has user id', function () {
		assert(player.id === 0);
		player.user = { id: 123 };
		assert(player.id === 123);
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

	it('has judge area', function () {
		assert(player.judgeArea);
		assert(CardAreaType.Judge);
		assert(player.judgeArea.type === CardAreaType.Judge);
	});
});
