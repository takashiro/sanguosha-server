import { SkillOwner } from '@karuta/sanguosha-core';

import Skill from '../../../../base/Skill';
import LuoShenJudge from './LuoShenJudge';
import LuoShenMove from './LuoShenMove';

export default class LuoShen extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'luoshen');
	}

	getEffects(): (LuoShenMove | LuoShenJudge)[] {
		return [
			new LuoShenMove(this),
			new LuoShenJudge(this),
		];
	}
}
