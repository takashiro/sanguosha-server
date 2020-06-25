import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class WuShuang extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'wushuang', [Tag.Compulsory]);
	}
}
