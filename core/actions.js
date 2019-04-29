
const cmd = require('../cmd');

const act = new Map;

for (let key in cmd) {
	const id = cmd[key];

	try {
		const func = require('../cmd/' + key);
		act.set(id, func);
	} catch (error) {
		//TO-DO: Append an error log or bind a default handler
	}
}

module.exports = act;
