
const State = {
	Starting: 0,
	Running: 1,
	Stopped: 2,
};

class EventDriver {

	constructor() {
		this._listeners = new Map;
		this._state = State.Starting;
	}

	isStopped() {
		return this._state === State.Stopped;
	}

	isRunning() {
		return this._state === State.Running;
	}

	start() {
		this._state = State.Running;
	}

	stop() {
		this._state = State.Stopped;
	}

	register(listener) {
		let handlers = this._listeners.get(listener.event);
		if (!handlers) {
			handlers = [];
			this._listeners.set(listener.event, handlers);
		}

		handlers.push(listener);
	}

	async trigger(event, player = null, data = null) {
		if (this.isStopped()) {
			return false;
		}

		const listners = this._listeners.get(event);
		if (!listners) {
			return false;
		}

		const triggerableListeners = listners.filter(handler => handler.triggerable(this, player, data));
		for (const listener of triggerableListeners) {
			if (await listener.cost(this, player, data)) {
				const prevented = await listener.effect(this, player, data);
				if (prevented) {
					return true;
				}
			}
		}

		return false;
	}

}

module.exports = EventDriver;
