import InstantTrickCard from './InstantTrickCard';

class FixedTargetTrickCard extends InstantTrickCard {
	async targetFilter(): Promise<boolean> {
		return false;
	}

	async targetFeasible(): Promise<boolean> {
		return true;
	}
}

export default FixedTargetTrickCard;
