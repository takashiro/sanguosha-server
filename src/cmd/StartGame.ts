import { User } from '@karuta/core';
import { Command } from '@karuta/sanguosha-core';

import Action from '../core/Action';
import GameDriver from '../driver';

import ModeMap from '../mode';

class StartGame extends Action<void, void> {
	constructor() {
		super(Command.StartGame);
	}

	async process(user: User): Promise<void> {
		const driver = user.getDriver() as GameDriver;
		if (!driver) {
			return;
		}


		const config = driver.getConfig();
		const { mode = 'standard' } = config;
		const rules = ModeMap.get(mode);
		if (rules) {
			for (const RuleClass of rules) {
				driver.register(new RuleClass());
			}
		}

		driver.start();
	}
}

export default StartGame;
