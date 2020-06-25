import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class TieQi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'tieqi');
	}
}
