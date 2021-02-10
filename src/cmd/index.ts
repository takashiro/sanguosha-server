import { Action } from '@karuta/core';
import { Command } from '@karuta/sanguosha-core';

import StartGame from './StartGame';

const actions: Action<unknown, unknown>[] = [
	new StartGame(),
];

export const ActionMap = new Map<Command, Action<unknown, unknown>>();

for (const action of actions) {
	ActionMap.set(action.getCommand(), action);
}

export default ActionMap;
