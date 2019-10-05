
const assert = require('assert');
const sinon = require('sinon');

const cmd = require('../cmd');

const Card = require('../core/Card');
const Player = require('../core/Player');

const GameDriver = require('../driver');
const CardUseStruct = require('../driver/CardUseStruct');

describe('GameDriver - Use Card', function () {
	this.afterEach(function () {
		sinon.restore();
	});

	const room = {
		broadcast: sinon.fake(),
	};
	const driver = new GameDriver(room);

	it('accepts invalid parameter', function () {
		const use = new CardUseStruct();
		const success = driver.useCard(use);
		assert(!success);
	});

	it('proceed card effects', function () {
		const card = new Card();
		card.onUse = sinon.fake();
		card.use = sinon.fake();

		const use = new CardUseStruct(new Player(), card);
		driver.useCard(use);

		sinon.assert.calledOnce(card.onUse);
		sinon.assert.calledWith(card.onUse, driver, use);
		sinon.assert.calledOnce(room.broadcast);
		sinon.assert.calledWith(room.broadcast, cmd.UseCard, use.toJSON());
		sinon.assert.calledOnce(card.use);
		sinon.assert.calledWith(card.use, driver, use);
	});
});
