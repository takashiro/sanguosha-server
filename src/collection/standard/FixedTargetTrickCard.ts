import TrickCard from '../TrickCard';

class FixedTargetTrickCard extends TrickCard {
	async targetFilter(): Promise<boolean> {
		return false;
	}

	async targetFeasible(): Promise<boolean> {
		return true;
	}
}

export default FixedTargetTrickCard;
