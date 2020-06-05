import EventListener from './EventListener';

enum State {
	Starting,
	Running,
	Stopped,
}

class EventDriver<EventType> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected listeners: Map<EventType, EventListener<EventType, any>[]>;

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
	 * Register an listener.
	 * @param listener
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register(listener: EventListener<EventType, any>): void {
		if (!listener.event) {
			console.error('Failed to register undefined event handler');
			return;
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
	 * Trigger an event. Corresponding listeners will be triggered.
	 * If this driver is stopped, it does nothing.
	 * @param event
	 * @param data
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async trigger(event: EventType, data: any = null): Promise<boolean> {
		if (this.isStopped()) {
			return false;
		}

		const eventListeners = this.listeners.get(event);
		if (!eventListeners) {
			return false;
		}

		const listeners = eventListeners.filter((handler) => handler.isTriggerable(data));
		listeners.sort((a, b) => b.getPriority() - a.getPriority());

		for (const listener of listeners) {
			const prevented = await listener.effect(data);
			if (prevented) {
				return true;
			}
		}

		return false;
	}
}

export default EventDriver;
