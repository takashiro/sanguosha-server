import FixedTargetTrickCard from './FixedTargetTrickCard';
import GameDriver from '../../driver';
import CardUse from '../../driver/CardUse';

class AreaEffectTrickCard extends FixedTargetTrickCard {
	async onUse(driver: GameDriver, use: CardUse): Promise<void> {
		if (use.to.length <= 0) {
			const alivePlayers = driver.getAlivePlayers().filter((player) => player !== use.from);
			use.to.push(...alivePlayers);
		}
	}
}

export default AreaEffectTrickCard;
