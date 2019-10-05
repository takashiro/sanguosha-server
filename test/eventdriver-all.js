
const assert = require('assert');

const EventListener = require('../driver/EventListener');
const EventDriver = require('../driver/EventDriver');

class FakeTrigger extends EventListener {
	constructor(event, name) {
		super(event);
		this.name = name;
	}

	// eslint-disable-next-line no-unused-vars
	cost(driver, target, data) {
		return target && target.invoke;
	}

	// eslint-disable-next-line no-unused-vars
	effect(driver, target, data) {
		data.push(this.name);
	}
}

describe('EventDriver', function () {
	const driver = new EventDriver();

	it('registers event listners', function () {
		driver.register(new FakeTrigger(1, 'test1-1'));
		driver.register(new FakeTrigger(1, 'test1-2'));
		driver.register(new FakeTrigger(2, 'test2-1'));
		driver.register(new FakeTrigger(2, 'test2-2'));
	});

	it('triggers events with cost rejected', async function () {
		const target = { invoke: false };
		const names = [];

		await driver.trigger(1, target, names);
		assert(names.length === 0);
	});

	it('triggers events with cost resolved', async function () {
		const target = { invoke: true };
		const names = [];

		await driver.trigger(1, target, names);
		assert(names.length === 2);
		assert(names.indexOf('test1-1') >= 0);
		assert(names.indexOf('test1-2') >= 0);
	});
});
