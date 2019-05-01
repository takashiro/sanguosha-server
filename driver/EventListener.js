
class EventListener {

	constructor(event) {
		this.event = event;
	}

	triggerable(driver, target, data) {
		return !!target;
	}

	async cost(driver, target, data) {
		return false;
	}

	async effect(driver, target, data) {
		return false;
	}

}

module.exports = EventListener;
