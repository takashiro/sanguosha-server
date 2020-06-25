import InstantTrickCard from './InstantTrickCard';

class FixedTargetTrickCard extends InstantTrickCard {
	async filterPlayer(): Promise<boolean> {
		return false;
	}

	async isFeasible(): Promise<boolean> {
		return true;
	}
}

export default FixedTargetTrickCard;
