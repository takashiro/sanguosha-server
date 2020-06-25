import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class HuJia extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'hujia', [Tag.Lord]);
	}
}
