import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class JiJiang extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jijiang', [Tag.Lord]);
	}
}
