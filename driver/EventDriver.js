
class EventDriver {

	constructor() {
		this._listeners = new Map;
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
		const listners = this._listeners.get(event);
		if (!listners) {
			return;
		}

		const triggerableListeners = listners.filter(handler => handler.triggerable(this, player, data));
		for (const listener of triggerableListeners) {
			if (await listener.cost(this, player, data)) {
				const prevented = await listener.effect(this, player, data);
				if (prevented) {
					break;
				}
			}
		}
	}

}

module.exports = EventDriver;
