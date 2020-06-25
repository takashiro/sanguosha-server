import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class YingZi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'yingzi');
	}
}
