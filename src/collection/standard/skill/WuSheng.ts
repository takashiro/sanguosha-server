import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class WuSheng extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'wusheng');
	}
}
