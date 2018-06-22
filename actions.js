
const net = require('./protocol');

const act = new Map;

act.set(net.StartGame, function () {
	const room = this.room;
	const driver = room.driver;
	if (driver) {
		driver.start();
	}
});

module.exports = act;
