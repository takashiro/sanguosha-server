import { User } from '@karuta/core';
import { Command } from '@karuta/sanguosha-core';

import Action from '../core/Action';
import GameDriver from '../driver';

class StartGame extends Action<void, void> {
	constructor() {
		super(Command.StartGame);
	}

	async process(user: User): Promise<void> {
		const driver = user.getDriver() as GameDriver;
		if (!driver) {
			return;
		}
		driver.start();
	}
}

export default StartGame;
