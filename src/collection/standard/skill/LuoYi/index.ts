import { SkillOwner } from '@karuta/sanguosha-core';

import Skill from '../../../../base/Skill';
import LuoYiDraw from './LuoYiDraw';
import LuoYiDamage from './LuoYiDamage';

export default class LuoYi extends Skill {
	protected effectiveRound: number;

	constructor(owner: SkillOwner) {
		super(owner, 'luoyi');
		this.effectiveRound = -1;
	}

	setEffectiveRound(round: number): void {
		this.effectiveRound = round;
	}

	getEffectiveRound(): number {
		return this.effectiveRound;
	}

	getEffects(): (LuoYiDraw | LuoYiDamage)[] {
		return [
			new LuoYiDraw(this),
			new LuoYiDamage(this),
		];
	}
}
