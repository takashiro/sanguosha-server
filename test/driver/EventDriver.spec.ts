import { EventListener } from '@karuta/sanguosha-pack';
import EventDriver from '../../src/driver/EventDriver';

class FakeTrigger extends EventListener<number> {
	async select() {
		return 0;
	}
}

it('should refuse undefined event', () => {
	const driver = new EventDriver();
	expect(() => driver.register({} as unknown as EventListener<unknown>)).toThrowError('Failed to register undefined event handler');
});

it('triggers corresponding listeners', async () => {
	const driver = new EventDriver();
	const triggers = [
		new FakeTrigger(1),
		new FakeTrigger(2),
		new FakeTrigger(2),
	];
	const processFn = triggers.map((trigger) => jest.spyOn(trigger, 'process'));

	for (const trigger of triggers) {
		driver.register(trigger);
	}

	const data = { id: 'test' };
	await driver.trigger(2, data);

	expect(processFn[0]).not.toBeCalled();
	expect(processFn[1]).toBeCalledTimes(1);
	expect(processFn[2]).toBeCalledTimes(1);
	expect(processFn[1].mock.invocationCallOrder[0]).toBeLessThan(processFn[2].mock.invocationCallOrder[0]);
});

it('unregisters a listener', async () => {
	const driver = new EventDriver();
	const trigger = new FakeTrigger(1);
	const process = jest.spyOn(trigger, 'process');

	driver.register(trigger);
	await driver.trigger(1, {});
	expect(process).toBeCalled();

	process.mockClear();
	driver.unregister(trigger);
	await driver.trigger(1, undefined);
	expect(process).not.toBeCalled();
});

it('unregisters an invalid listener', async () => {
	const driver = new EventDriver();
	expect(() => driver.unregister({} as unknown as EventListener<unknown>)).toThrowError('Failed to unregister undefined event handler');
});

it('unregisters a non-existing listener', async () => {
	const driver = new EventDriver();
	const listeners = Reflect.get(driver, 'listeners') as Map<number, EventListener<unknown>[]>;
	driver.unregister({ event: 1 } as unknown as EventListener<unknown>);
	expect(listeners.size).toBe(0);

	driver.register(new FakeTrigger(1));
	driver.unregister({ event: 1 } as unknown as EventListener<unknown>);
	expect(listeners.size).toBe(1);
	expect(listeners?.get(1)?.length).toBe(1);
});

it('triggers nothing if it is stopped', async () => {
	const driver = new EventDriver();
	const trigger = new FakeTrigger(1);
	jest.spyOn(trigger, 'isTriggerable').mockReturnValue(true);
	const process = jest.spyOn(trigger, 'process');
	driver.register(trigger);
	driver.stop();
	const isStopped = jest.spyOn(driver, 'isStopped');
	await driver.trigger(1, undefined);
	expect(isStopped).toBeCalledTimes(1);
	expect(process).not.toBeCalled();
});

it('triggers nothing if the listener is not selected', async () => {
	const driver = new EventDriver();
	const trigger = new FakeTrigger(1);
	const select = jest.spyOn(trigger, 'select');
	const process = jest.spyOn(trigger, 'process');
	driver.register(trigger);

	select.mockResolvedValue(-1);
	await driver.trigger(1, {});

	expect(process).not.toBeCalled();
});

it('always trigger compulsory listeners', async () => {
	const t1 = new FakeTrigger(1);
	jest.spyOn(t1, 'select').mockResolvedValue(-1);

	const t2 = new FakeTrigger(1);
	jest.spyOn(t2, 'isCompulsory').mockReturnValue(true);
	jest.spyOn(t2, 'select').mockResolvedValue(-1);
	const process = jest.spyOn(t2, 'process');

	const driver = new EventDriver();
	driver.register(t1);
	driver.register(t2);
	await driver.trigger(1, {});

	expect(process).toBeCalledTimes(1);
});

it('prevents consequence listeners if one listener returns true', async () => {
	const triggers = [
		new FakeTrigger(1),
		new FakeTrigger(1),
	];
	const process = [
		jest.spyOn(triggers[0], 'process').mockResolvedValue(true),
		jest.spyOn(triggers[1], 'process'),
	];

	const driver = new EventDriver();
	for (const trigger of triggers) {
		driver.register(trigger);
	}

	const prevented = await driver.trigger(1, {});
	expect(prevented).toBe(true);
	expect(process[0]).toBeCalled();
	expect(process[1]).not.toBeCalled();
});
