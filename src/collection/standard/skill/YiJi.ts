import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class YiJi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'yiji');
	}
}
