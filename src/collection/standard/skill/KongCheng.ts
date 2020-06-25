import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class KongCheng extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'kongcheng', [Tag.Compulsory]);
	}
}
