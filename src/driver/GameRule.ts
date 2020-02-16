import EventListener from './EventListener';
import GameEvent from './GameEvent';
import GameDriver from './GameDriver';

class GameRule<ParamType> extends EventListener<GameEvent, ParamType> {
	getDriver(): GameDriver {
		return super.getDriver() as GameDriver;
	}

	isTriggerable(data: ParamType): boolean {
		return !data;
	}

	async cost(): Promise<boolean> {
		return true;
	}
}

export default GameRule;
