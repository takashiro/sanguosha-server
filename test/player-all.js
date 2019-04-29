
const assert = require('assert');
const Player = require('../core/Player');

describe('Player', function () {
	const player = new Player;

	it('sets/gets HP', function () {
		player.setHp(4);
		assert(player.hp() === 4);
	});

	it('sets/gets max HP', function () {
		player.setMaxHp(4);
		assert(player.maxHp() === 4);
	});

	it('is not wounded', function () {
		assert(!player.isWounded());
	});

	it('is alive', function () {
		assert(player.isAlive());
		assert(!player.isDead());
	});

	it('is wounded', function () {
		player.setHp(1);
		assert(player.isAlive());
		assert(player.lostHp() === 3);
	});

});
