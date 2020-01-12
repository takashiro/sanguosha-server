import EventDriver from './EventDriver';

class EventListener<EventType, ParamType> {
	protected driver: EventDriver<EventType> | null;

	readonly event: EventType;

	constructor(event: EventType) {
		this.driver = null;
		this.event = event;
	}

	/**
	 * Sets event driver.
	 * @param driver
	 */
	setDriver(driver: EventDriver<EventType>): void {
		this.driver = driver;
	}

	/**
	 * @return event driver
	 */
	getDriver(): EventDriver<EventType> | null {
		return this.driver;
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
	 * Execute cost.
	 * @param target
	 * @param data
	 * @return Whether the cost is executed. If yes, the listener takes effect afterwards.
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async cost(data: ParamType): Promise<boolean> {
		return false;
	}

	/**
	 * Execute effect.
	 * @param target
	 * @param data
	 * @return Whether to break following event listeners in the same chain.
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async effect(data: ParamType): Promise<boolean> {
		return false;
	}
}

export default EventListener;
