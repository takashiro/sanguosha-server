import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class JiuYuan extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jiuyuan', [Tag.Lord, Tag.Compulsory]);
	}
}
