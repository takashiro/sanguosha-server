
const cmd = require('../cmd');

const act = new Map();

for (const key of Object.keys(cmd)) {
	const id = cmd[key];

	try {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const func = require(`../cmd/${key}`);
		act.set(id, func);
	} catch (error) {
		// TO-DO: Append an error log or bind a default handler
	}
}

module.exports = act;
