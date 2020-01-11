
const EventListener = require('./EventListener');

class GameRule extends EventListener {
	isTriggerable(target) {
		return Boolean(this.driver && !target);
	}

	async cost() {
		return true;
	}
}

module.exports = GameRule;
