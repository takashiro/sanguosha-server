import {
	SkillTag as Tag,
	SkillOwner as Owner,
} from '@karuta/sanguosha-core';

import MonadicSkill from '../../../base/MonadicSkill';
import DistanceVector from '../../../driver/DistanceVector';
import GameEvent from '../../../driver/GameEvent';

export default class MaShu extends MonadicSkill<DistanceVector> {
	constructor(owner: Owner) {
		super(owner, 'mashu', GameEvent.CalculatingDistance, [Tag.Compulsory]);
	}

	isTriggerable(vector: DistanceVector): boolean {
		return vector.from === this.getOwner() && vector.to !== this.getOwner();
	}

	async process(vector: DistanceVector): Promise<boolean> {
		vector.distance -= 1;
		return false;
	}
}
