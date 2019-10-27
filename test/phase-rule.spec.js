const assert = require('assert');
const sinon = require('sinon');

const PhaseRule = require('../src/mode/basic/PhaseRule');
const Phase = require('../src/core/Player/Phase');

describe('Phase Rule', function () {
	const rule = new PhaseRule();

	it('checks driver and target', function () {
		rule.setDriver(null);
		assert.strictEqual(rule.isTriggerable(null), false);
		assert.strictEqual(rule.isTriggerable({}), false);

		rule.setDriver({});
		assert.strictEqual(rule.isTriggerable(null), false);
		assert.strictEqual(rule.isTriggerable({}), true);
	});

	it('draws 2 cards', async function () {
		const player = {};
		const driver = {
			trigger() {},
			drawCards: sinon.spy(),
		};
		rule.setDriver(driver);

		await rule.effect(player, {
			to: Phase.Draw,
		});

		sinon.assert.calledOnceWithExactly(driver.drawCards, player, 2);
	});

	it('activates a player', async function () {
		let count = 0;
		const player = {
			async play() {
				count++;
				return count < 3;
			},
		};

		await rule.effect(player, {
			to: Phase.Play,
		});

		assert.strictEqual(count, 3);
	});

	it('discards overflow hand cards', async function () {
		const selected = [1, 2, 3];
		const player = {
			handArea: {
				size: 10,
			},
			getHp() {
				return 3;
			},
			askForCards: sinon.stub().returns(selected),
		};
		const driver = {
			discardPile: {},
			trigger: sinon.fake(),
			moveCards: sinon.spy(),
		};
		rule.setDriver(driver);

		await rule.effect(player, {
			to: Phase.Discard,
		});

		sinon.assert.calledOnceWithExactly(driver.moveCards, selected, player.handArea, driver.discardPile, { open: true });
	});

	it('does nothing by default', async function () {
		await rule.effect({}, {});
	});
});
