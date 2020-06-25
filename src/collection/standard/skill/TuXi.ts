import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class TuXi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'tuxi');
	}
}
