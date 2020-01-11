
class EventListener {
	constructor(event) {
		this.driver = null;
		this.event = event;
	}

	/**
	 * Sets event driver.
	 * @param {EventDriver} driver
	 */
	setDriver(driver) {
		this.driver = driver;
	}

	/**
	 * Gets event driver.
	 * @return {EventDriver}
	 */
	getDriver() {
		return this.driver;
	}

	/**
	 * Check if the listener can be triggered.
	 * @param {ServerPlayer} target
	 * @param {*} data
	 * @return {boolean}
	 */
	// eslint-disable-next-line no-unused-vars
	isTriggerable(target, data) {
		return Boolean(this.driver && target);
	}

	/**
	 * Execute cost.
	 * @param {ServerPlayer} target
	 * @param {*} data
	 * @return {boolean} Whether the cost is executed. If yes, the listener takes effect afterwards.
	 */
	// eslint-disable-next-line no-unused-vars
	async cost(target, data) {
		return false;
	}

	/**
	 * Execute effect.
	 * @param {ServerPlayer} target
	 * @param {*} data
	 * @return {boolean} Whether to break following event listeners in the same chain.
	 */
	// eslint-disable-next-line no-unused-vars
	async effect(target, data) {
		return false;
	}
}

module.exports = EventListener;
