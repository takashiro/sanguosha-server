import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class LianYing extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'lianying');
	}
}
