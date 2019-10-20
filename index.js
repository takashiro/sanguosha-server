
const defaultConfig = require('./config.default.json');
const GameDriver = require('./src/driver');

const actions = require('./src/core/actions');

class KarutaDriver extends GameDriver {
	/**
	 * Create a game driver for the room
	 * @param {Room} room
	 */
	constructor(room) {
		super(room);
		this.config = { ...defaultConfig };
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	getConfig() {
		return this.config;
	}

	getAction(command) {
		return actions.get(command);
	}
}

module.exports = KarutaDriver;
