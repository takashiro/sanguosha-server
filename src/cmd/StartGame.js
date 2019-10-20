
function StartGame() {
	const driver = this.getDriver();
	if (!driver) {
		return;
	}

	const config = driver.getConfig();
	const mode = config.mode || 'standard';

	try {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const ruleClasses = require(`../mode/${mode}`);
		for (const RuleClass of ruleClasses) {
			driver.register(new RuleClass());
		}
	} catch (error) {
		console.error(error);
	}

	driver.start();
}

module.exports = StartGame;
