import InstantTrickCard from './InstantTrickCard';
import GameDriver from '../driver/GameDriver';
import ServerPlayer from '../driver/ServerPlayer';

export default class MonadicTrickCard extends InstantTrickCard {
	async isFeasible(driver: GameDriver, selected: ServerPlayer[], source: ServerPlayer): Promise<boolean> {
		return driver && source && selected.length === 1;
	}

	async filterPlayer(driver: GameDriver, selected: ServerPlayer[], target: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		return driver && target && source && selected.length < 1;
	}
}
