import {
	EventListener,
	EventType,
} from '@karuta/sanguosha-pack';

import GameDriver from './GameDriver';

class GameRule<ParamType> extends EventListener<ParamType> {
	protected idle = 1000;

	constructor(event: EventType) {
		super(event);
		this.compulsory = true;
	}

	getIdle(): number {
		return this.idle;
	}

	setIdle(idle: number): void {
		this.idle = idle;
	}

	getDriver(): GameDriver {
		return super.getDriver() as GameDriver;
	}

	weigh(): number {
		return 1000;
	}

	async select(listeners: GameRule<ParamType>[]): Promise<number> {
		return listeners.length > 0 ? 0 : -1;
	}

	isTriggerable(data: ParamType): boolean {
		return !data;
	}
}

export default GameRule;
