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

		it('plays a card', async function () {
			const driver = {
				useCard: sinon.spy(),
			};
			user.getDriver = sinon.stub().returns(driver);
			user.request = sinon.stub().returns({ cards: [card1.getId()] });
			const playCard = sinon.stub(player, 'playCard');
			playCard.withArgs(card1).returns(true);
			assert(await player.play());
			assert(playCard.calledOnceWith(card1));

			delete user.getDriver;
			delete user.request;
			playCard.restore();
		});
	});

	describe('#playCard()', function () {
		const driver = {
			players: [
				new ServerPlayer(),
				new ServerPlayer(),
				new ServerPlayer(),
				new ServerPlayer(),
			],
			findPlayer(seat) { return this.players[seat - 1]; },
			getPlayers() { return this.players; },
			useCard: sinon.spy(),
		};

		this.beforeAll(function () {
			user.getDriver = sinon.stub().returns(driver);
		});

		this.afterAll(function () {
			delete user.getDriver;
			delete user.request;
		});

		const fakeCard = {
			isAvailable() { return true; },
			targetFilter: sinon.fake(),
			targetFeasible: sinon.fake(),
		};

		const someCard = {
			isAvailable() { return true; },
			targetFeasible() { return true; },
			targetFilter() { return true; },
		};

		it('should reject unavailable cards', async function () {
			const card = {
				isAvailable: sinon.stub().returns(false),
			};
			assert(!await player.playCard(card));
			assert(card.isAvailable.calledOnceWith(player));
		});

		it('should handle timeout error', async function () {
			user.request = sinon.stub().throws(new Error('timeout'));
			assert(!await player.playCard(fakeCard));
		});

		it('should handle cancel command', async function () {
			user.request = sinon.stub().returns({ cancel: true });
			assert(await player.playCard(fakeCard));
			user.request = sinon.stub().returns(null);
			assert(await player.playCard(fakeCard));
		});

		it('should handle non-existing player', async function () {
			user.request = sinon.stub().returns({ player: 100 });
			assert(!await player.playCard(fakeCard));
		});

		it('should reject invalid card targets', async function () {
			const card = {
				isAvailable() { return true; },
				targetFeasible(selected) {
					return selected.length === 1;
				},
				targetFilter(selected, target) {
					return selected.length === 0 && target !== null;
				},
			};

			user.request = sinon.stub()
				.onCall(0)
				.returns({ player: 1, selected: false })
				.onCall(1)
				.returns({ player: 1, selected: true })
				.onCall(2)
				.returns({ player: 1, selected: true });

			assert(!await player.playCard(card));
		});

		it('should stop if no confirm or selection command is received', async function () {
			user.request = sinon.stub().returns({});
			assert(!await player.playCard(someCard));
		});

		it('should stop if targets are not feasible', async function () {
			const card = {
				isAvailable() { return true; },
				targetFeasible() { return false; },
				targetFilter() { return true; },
			};

			user.request = sinon.stub().returns({ confirm: true });
			assert(!await player.playCard(card));
		});

		it('should handle duplicate add or removal', async function () {
			user.request = sinon.stub()
				.onCall(0)
				.returns({ player: 1, selected: true })
				.onCall(1)
				.returns({ player: 1, selected: true })
				.onCall(2)
				.returns({ player: 2, selected: true })
				.onCall(3)
				.returns({ player: 2, selected: false })
				.onCall(4)
				.returns({ player: 2, selected: false })
				.onCall(5)
				.returns({ confirm: true });

			assert(await player.playCard(someCard));
			const use = driver.useCard.firstCall.args[0];
			assert(use.to && use.to.length === 1);
			assert(use.from === player);
			assert(use.to[0] === driver.players[0]);
			assert(use.card === someCard);
			driver.useCard.resetHistory();
		});
	});
});
