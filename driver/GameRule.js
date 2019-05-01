
const EventListener = require('./EventListener');

class GameRule extends EventListener {

	triggerable(driver, target) {
		return driver && !target;
	}

	async cost() {
		return true;
	}

}

module.exports = GameRule;
