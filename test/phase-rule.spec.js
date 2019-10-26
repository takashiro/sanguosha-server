const assert = require('assert');
const sinon = require('sinon');

const PhaseRule = require('../src/mode/basic/PhaseRule');
const Phase = require('../src/core/Player/Phase');

describe('Phase Rule', function () {
	const rule = new PhaseRule();

	it('checks driver and target', function () {
		assert.strictEqual(rule.triggerable(null, null), false);
		assert.strictEqual(rule.triggerable(null, {}), false);
		assert.strictEqual(rule.triggerable({}, null), false);
		assert.strictEqual(rule.triggerable({}, {}), true);
	});

	it('draws 2 cards', async function () {
		const player = {};
		const driver = {
			trigger() {},
			drawCards: sinon.spy(),
		};

		await rule.effect(driver, player, {
			to: Phase.Draw,
		});

		assert(driver.drawCards.calledOnceWithExactly(player, 2));
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

		await rule.effect(driver, player, {
			to: Phase.Discard,
		});

		assert(driver.moveCards.calledOnceWithExactly(selected, player.handArea, driver.discardPile, { open: true }));
	});

	it('does nothing by default', async function () {
		await rule.effect({}, {}, {});
	});
});
