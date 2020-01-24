import { Action as ActionInterface, User } from '@karuta/core';
import { Command } from '@karuta/sanguosha-core';

abstract class Action<Request, Response> implements ActionInterface<Request, Response> {
	command: Command;

	constructor(command: Command) {
		this.command = command;
	}

	getCommand(): Command {
		return this.command;
	}

	abstract process(user: User, req: Request): Promise<Response>;
}

export default Action;
