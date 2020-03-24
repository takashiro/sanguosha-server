import TrickCard from '../TrickCard';
import GameDriver from '../../driver';
import ServerPlayer from '../../driver/ServerPlayer';

export default class MonadicTrickCard extends TrickCard {
	async targetFeasible(driver: GameDriver, selected: ServerPlayer[], source: ServerPlayer): Promise<boolean> {
		return driver && source && selected.length === 1;
	}

	async targetFilter(driver: GameDriver, selected: ServerPlayer[], target: ServerPlayer): Promise<boolean> {
		return driver && target && selected.length < 1;
	}
}
