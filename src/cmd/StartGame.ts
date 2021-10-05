import { User } from '@karuta/core';
import { Context } from '@karuta/sanguosha-core';
import { GameDriver } from '@karuta/sanguosha-pack';

import Action from '../core/Action';
import ModeMap from '../mode';

class StartGame extends Action {
	constructor(driver: GameDriver, user: User) {
		super(Context.Game, driver, user);
	}

	async put(): Promise<void> {
		const mode = 'standard';
		const rules = ModeMap.get(mode);
		if (rules) {
			for (const RuleClass of rules) {
				this.driver.register(new RuleClass());
			}
		}

		this.driver.start();
	}
}

export default StartGame;
