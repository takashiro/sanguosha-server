import { User } from '@karuta/core';
import { GameDriver } from '@karuta/sanguosha-pack';

import Action from '../core/Action';

import Game from './Game';

type ContextHandler = new(driver: GameDriver, user: User) => Action;

const handlers: ContextHandler[] = [
	Game,
];

export default handlers;
