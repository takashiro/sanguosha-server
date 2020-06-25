import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class PaoXiao extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'paoxiao');
	}
}
