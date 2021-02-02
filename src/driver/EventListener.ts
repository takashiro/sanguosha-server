import EventDriver from './EventDriver';

abstract class EventListener<EventType, ParamType> {
	protected driver: EventDriver<EventType> | null;

	readonly event: EventType;

	protected compulsory: boolean;

	constructor(event: EventType) {
		this.driver = null;
		this.event = event;
		this.compulsory = false;
	}

	/**
	 * Sets event driver.
	 * @param driver
	 */
	setDriver(driver: EventDriver<EventType> | null): void {
		this.driver = driver;
	}

	/**
	 * @return event driver
	 */
	getDriver(): EventDriver<EventType> | null {
		return this.driver;
	}

	isCompulsory(): boolean {
		return this.compulsory;
	}

	/**
	 * Check if the listener can be triggered.
	 * @param target
	 * @param data
	 */
	isTriggerable(data: ParamType): boolean {
		return Boolean(this.driver && data);
	}

	/**
	 * Calculate the priority of the event listener.
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	weigh(data: ParamType): number {
		return 0;
	}

	/**
	 * Select a listener when multiple listeners are of the same priority.
	 * @param listeners
	 * @return Index of the selected listener
	 */
	abstract select(listeners: EventListener<EventType, ParamType>[], data: ParamType): Promise<number>;

	/**
	 * Process the event.
	 * @param target
	 * @param data
	 * @return Whether to break following event listeners in the same chain.
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async process(data: ParamType): Promise<boolean> {
		return false;
	}
}

export default EventListener;
