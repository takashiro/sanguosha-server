import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class QiXi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'qixi');
	}
}
