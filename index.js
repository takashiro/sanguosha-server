
const actions = require('./actions');
const defaultConfig = require('./config');
const GameDriver = require('./driver');

class KarutaDriver extends GameDriver {

	/**
	 * Create a game driver for the room
	 * @param {Room} room
	 */
	constructor(room) {
		super(room);
		this.config = {...defaultConfig};
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	getConfig() {
		return this.config;
	}

	get actions() {
		return actions;
	}

}

module.exports = KarutaDriver;
