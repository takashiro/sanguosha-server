import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class TianDu extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'tiandu');
	}
}
