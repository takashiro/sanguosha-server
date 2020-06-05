import EventListener from '../src/driver/EventListener';
import EventDriver from '../src/driver/EventDriver';

class FakeTrigger extends EventListener {
	constructor(event, name) {
		super(event);
		this.name = name;
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

	it('triggers events', async () => {
		const target = { invoke: true };
		const names = [];

		await driver.trigger(1, { target, names });
		expect(names).toHaveLength(1);
		expect(names).toContain('test1-1');
		expect(names).toContain('test1-2');
	});
});
