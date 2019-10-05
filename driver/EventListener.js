
class EventListener {
	constructor(event) {
		this.event = event;
	}

	// eslint-disable-next-line no-unused-vars
	triggerable(driver, target, data) {
		return !!target;
	}

	// eslint-disable-next-line no-unused-vars
	async cost(driver, target, data) {
		return false;
	}

	// eslint-disable-next-line no-unused-vars
	async effect(driver, target, data) {
		return false;
	}
}

module.exports = EventListener;
