import { User } from '@karuta/core';
import { Context, GameConfig } from '@karuta/sanguosha-core';
import { GameDriver } from '@karuta/sanguosha-pack';

import Action from '../core/Action';
import ModeMap from '../mode';

class Game extends Action {
	constructor(driver: GameDriver, user: User) {
		super(Context.Game, driver, user);
	}

	async put(params: Partial<GameConfig> = {}): Promise<void> {
		const {
			mode = 'standard',
		} = params;
		const rules = ModeMap.get(mode);
		if (rules) {
			for (const RuleClass of rules) {
				this.driver.register(new RuleClass());
			}
		}

		this.driver.start();
	}
}

export default Game;
