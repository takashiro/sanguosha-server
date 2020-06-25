import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class LongDan extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'longdan');
	}
}
