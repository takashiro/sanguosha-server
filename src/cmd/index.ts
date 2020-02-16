import { Action } from '@karuta/core';
import { Command } from '@karuta/sanguosha-core';

import StartGame from './StartGame';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actions: Action<any, any>[] = [
	new StartGame(),
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ActionMap = new Map<Command, Action<any, any>>();

for (const action of actions) {
	ActionMap.set(action.getCommand(), action);
}

export default ActionMap;
