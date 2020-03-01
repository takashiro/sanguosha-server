import EventListener from '../src/driver/EventListener';
import EventDriver from '../src/driver/EventDriver';

class FakeTrigger extends EventListener {
	constructor(event, name) {
		super(event);
		this.name = name;
	}

	cost({ target }) {
		return target && target.invoke;
	}

	effect({ names }) {
		names.push(this.name);
	}
}

describe('EventDriver', () => {
	const driver = new EventDriver();

	it('registers event listners', () => {
		driver.register(new FakeTrigger(1, 'test1-1'));
		driver.register(new FakeTrigger(1, 'test1-2'));
		driver.register(new FakeTrigger(2, 'test2-1'));
		driver.register(new FakeTrigger(2, 'test2-2'));
	});

	it('triggers events with cost rejected', async () => {
		const target = { invoke: false };
		const names = [];

		await driver.trigger(1, { target, names });
		expect(names.length).toBe(0);
	});

	it('triggers events with cost resolved', async () => {
		const target = { invoke: true };
		const names = [];

		await driver.trigger(1, { target, names });
		expect(names.length).toBe(2);
		expect(names.indexOf('test1-1')).toBeGreaterThanOrEqual(0);
		expect(names.indexOf('test1-2')).toBeGreaterThanOrEqual(0);
	});
});
