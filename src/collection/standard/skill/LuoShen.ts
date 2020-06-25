import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class LuoShen extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'luoshen');
	}
}
