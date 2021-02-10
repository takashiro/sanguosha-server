import {
	EventType,
	EventListener,
} from '@karuta/sanguosha-pack';

enum State {
	Starting,
	Running,
	Stopped,
}

interface PriorityListener<ParamType> {
	listener: EventListener<ParamType>;
	weight: number;
}

class EventDriver {
	protected listeners: Map<EventType, EventListener<unknown>[]>;

	protected state: State;

	constructor() {
		this.listeners = new Map();
		this.state = State.Starting;
	}

	isStopped(): boolean {
		return this.state === State.Stopped;
	}

	isRunning(): boolean {
		return this.state === State.Running;
	}

	start(): void {
		this.state = State.Running;
	}

	stop(): void {
		this.state = State.Stopped;
	}

	/**
	 * Register a listener.
	 * @param listener
	 */
	register(listener: EventListener<unknown>): void {
		if (!listener.event) {
			throw new Error('Failed to register undefined event handler');
		}

		let handlers = this.listeners.get(listener.event);
		if (!handlers) {
			handlers = [];
			this.listeners.set(listener.event, handlers);
		}

		listener.setDriver(this);
		handlers.push(listener);
	}

	/**
	 * Unregister a listener.
	 * @param listener
	 */
	unregister(listener: EventListener<unknown>): void {
		if (!listener.event) {
			throw new Error('Failed to unregister undefined event handler');
		}

		const handlers = this.listeners.get(listener.event);
		if (!handlers) {
			return;
		}

		const i = handlers.indexOf(listener);
		if (i < 0) {
			return;
		}

		listener.setDriver(undefined);
		handlers.splice(i, 1);
	}

	/**
	 * Trigger an event. Corresponding listeners will be triggered.
	 * If this driver is stopped, it does nothing.
	 * @param event
	 * @param data
	 */
	async trigger<ParamType>(event: EventType, data: ParamType): Promise<boolean> {
		if (this.isStopped()) {
			return false;
		}

		const eventListeners = this.listeners.get(event);
		if (!eventListeners) {
			return false;
		}

		const listeners = eventListeners.filter((handler) => handler.isTriggerable(data)) as EventListener<ParamType>[];
		if (listeners.length <= 0) {
			return false;
		}

		if (listeners.length === 1) {
			const [listener] = listeners;
			if (listener.isCompulsory() || await listener.select(listeners, data) === 0) {
				const prevented = await listener.process(data);
				return prevented;
			}
			return false;
		}

		const listenerData: PriorityListener<ParamType>[] = listeners.map((listener) => ({
			listener,
			weight: listener.weigh(data),
		}));
		listenerData.sort((a, b) => a.weight - b.weight);

		while (listenerData.length > 0) {
			const { weight } = listenerData[0];
			let j = 1;
			while (j < listenerData.length && listenerData[j].weight === weight) {
				j++;
			}
			let subset = listenerData.splice(0, j).map((d) => d.listener);
			while (subset.length > 0) {
				let selected = await subset[0].select(subset, data);
				if (selected < 0 || selected >= subset.length) {
					if (subset.some((sub) => !sub.isCompulsory())) {
						subset = subset.filter((sub) => sub.isCompulsory());
						continue;
					} else {
						selected = 0;
					}
				}
				const listener = subset[selected];
				const prevented = await listener.process(data);
				if (prevented) {
					return true;
				}
				subset.splice(selected, 1);
			}
		}

		return false;
	}
}

export default EventDriver;
