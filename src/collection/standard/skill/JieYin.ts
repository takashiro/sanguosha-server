import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class JieYin extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jieyin');
	}
}
