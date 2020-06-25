import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class JiJiu extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jijiu');
	}
}
