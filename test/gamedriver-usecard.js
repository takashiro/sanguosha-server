const assert = require('assert');
const sinon = require('sinon');

const cmd = require('../cmd');

const Card = require('../core/Card');
const Player = require('../core/Player');

const GameDriver = require('../driver');
const CardUseStruct = require('../driver/CardUseStruct');

describe('GameDriver#useCard()', function () {
	this.afterEach(function () {
		sinon.restore();
	});

	const room = {
		broadcast: sinon.spy(),
	};
	const driver = new GameDriver(room);

	it('accepts invalid parameter', function () {
		const use = new CardUseStruct();
		const success = driver.useCard(use);
		assert(!success);
	});

	it('proceed card effects', function () {
		const card = new Card();
		card.onUse = sinon.spy();
		card.use = sinon.spy();

		const use = new CardUseStruct(new Player(), card);
		driver.useCard(use);

		assert(card.onUse.calledOnceWith(driver, use));
		assert(room.broadcast.calledOnceWith(cmd.UseCard, use.toJSON()));
		assert(card.use.calledOnceWith(driver, use));
	});
});
