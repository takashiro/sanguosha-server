
function StartGame() {
	const driver = this.getDriver();
	if (!driver) {
		return;
	}

	const config = driver.getConfig();
	const mode = config.mode || 'standard';

	try {
		const ruleClasses = require(`../mode/${mode}`);
		for (const ruleClass of ruleClasses) {
			driver.register(new ruleClass());
		}
	} catch (error) {
		console.error(error);
	}

	driver.start();
}

module.exports = StartGame;
