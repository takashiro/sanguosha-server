import {
	ContextListener,
	User,
} from '@karuta/core';
import { Context } from '@karuta/sanguosha-core';
import { GameDriver } from '@karuta/sanguosha-pack';

export default abstract class Action implements ContextListener {
	context: Context;

	protected driver: GameDriver;

	protected user: User;

	constructor(context: Context, driver: GameDriver, user: User) {
		this.context = context;
		this.driver = driver;
		this.user = user;
	}
}
