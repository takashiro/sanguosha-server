import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class GangLie extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'ganglie');
	}
}
