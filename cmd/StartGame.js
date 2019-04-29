
function StartGame() {
	const room = this.room;
	const driver = room.driver;
	if (driver) {
		driver.start();
	}
}

module.exports = StartGame;
