import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class JiZhi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jizhi');
	}
}
