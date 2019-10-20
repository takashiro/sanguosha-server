const assert = require('assert');
const sinon = require('sinon');

const cmd = require('../src/cmd');
const ServerPlayer = require('../src/driver/ServerPlayer');

describe('ServerPlayer: Play Cards', function () {
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

	it('sets use limit of cards', function () {
		assert(player.getUseLimit('strike') === Infinity);
		player.setUseLimit('strike', 1);
		assert(player.getUseLimit('strike') === 1);
		player.clearUseLimit();
		assert(player.getUseLimit('strike') === Infinity);
	});

	describe('#play()', function () {
		const card1 = {
			getId() {
				return 1;
			},
			isAvailable() {
				return true;
			},
		};
		const card2 = {
			getId() {
				return 2;
			},
			isAvailable() {
				return false;
			},
		};

		player.handArea.add(card1);
		player.handArea.add(card2);

		it('handles timeout error', async function () {
			user.request = sinon.stub().throws(new Error('timeout'));
			const res = await player.play();
			assert(!res);
			assert(user.request.calledWith(cmd.Play));
		});

		it('filters available cards from hand area', async function () {
			user.request = sinon.spy();
			const res = await player.play();
			assert(!res);
			assert(user.request.calledOnceWith(cmd.Play, { cards: [1] }));
		});

		it('handles invalid card id from user response', async function () {
			user.request = sinon.stub().returns(null);
			assert(!await player.play());

			user.request = sinon.stub().returns({ cards: [] });
			assert(!await player.play());

			user.request = sinon.stub().returns({ cards: ['test', 'wer'] });
			assert(!await player.play());

			user.request = sinon.stub().returns({ cards: [3] });
			assert(!await player.play());

			user.request = sinon.stub().returns({ cards: [card2.getId()] });
			assert(!await player.play());
		});

		it('uses a card', async function () {
			const driver = {
				useCard: sinon.spy(),
			};
			user.getDriver = sinon.stub().returns(driver);
			user.request = sinon.stub().returns({ cards: [card1.getId()] });
			assert(await player.play());
			assert(driver.useCard.calledOnce);
			const use = driver.useCard.firstCall.args[0];
			assert(use.card === card1);
		});
	});
});
