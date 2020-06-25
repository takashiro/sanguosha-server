import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class QiCai extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'qicai', [Tag.Compulsory]);
	}
}
