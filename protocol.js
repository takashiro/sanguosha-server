

const net = require('../../core/protocol');

function defineCommand() {
	let cmd = Object.assign({}, net);
	for (let i = 0; i < arguments.length; i++) {
		cmd[arguments[i]] = net.NetworkCommandCount + i;
	}
	return cmd;
}

const cmd = defineCommand(
	'StartGame',
);

module.exports = cmd;
