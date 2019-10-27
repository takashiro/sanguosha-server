
const State = {
	Starting: 0,
	Running: 1,
	Stopped: 2,
};

class EventDriver {
	constructor() {
		this.listeners = new Map();
		this.state = State.Starting;
	}

	isStopped() {
		return this.state === State.Stopped;
	}

	isRunning() {
		return this.state === State.Running;
	}

	start() {
		this.state = State.Running;
	}

	stop() {
		this.state = State.Stopped;
	}

	/**
	 * Register an listener.
	 * @param {EventListener} listener
	 */
	register(listener) {
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
	 * @param {GameEvent} event
	 * @param {ServerPlayer} player
	 * @param {*} data
	 */
	async trigger(event, player = null, data = null) {
		if (this.isStopped()) {
			return false;
		}

		const listners = this.listeners.get(event);
		if (!listners) {
			return false;
		}

		const triggerableListeners = listners.filter((handler) => handler.isTriggerable(player, data));
		for (const listener of triggerableListeners) {
			if (await listener.cost(player, data)) {
				const prevented = await listener.effect(player, data);
				if (prevented) {
					return true;
				}
			}
		}

		return false;
	}
}

module.exports = EventDriver;
