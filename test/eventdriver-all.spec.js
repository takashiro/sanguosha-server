import EventListener from '../src/driver/EventListener';
import EventDriver from '../src/driver/EventDriver';

class FakeTrigger extends EventListener {
	constructor(event, name, priority) {
		super(event);
		this.name = name;
		this.priority = priority;
	}

	process(names) {
		names.push(this.name);
	}

	getPriority() {
		return this.priority;
	}
}

const driver = new EventDriver();

it('registers event listners', () => {
	driver.register(new FakeTrigger(1, 'test1-1', 1));
	driver.register(new FakeTrigger(1, 'test1-2', 2));
	driver.register(new FakeTrigger(2, 'test2-1', 3));
	driver.register(new FakeTrigger(2, 'test2-2', 4));
});

it('triggers events', async () => {
	const names = [];

	await driver.trigger(2, names);
	expect(names).toStrictEqual([
		'test2-2',
		'test2-1',
	]);
});
