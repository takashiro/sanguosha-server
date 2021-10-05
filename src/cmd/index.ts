import { User } from '@karuta/core';
import { GameDriver } from '@karuta/sanguosha-pack';

import Action from '../core/Action';

import StartGame from './StartGame';

type ActionCreator = new(driver: GameDriver, user: User) => Action;

const actions: ActionCreator[] = [
	StartGame,
];

export default actions;
