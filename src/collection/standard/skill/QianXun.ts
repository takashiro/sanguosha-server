import {
	Skill,
	SkillTag as Tag,
	SkillOwner,
} from '@karuta/sanguosha-core';

export default class QianXun extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'qianxun', [Tag.Compulsory]);
	}
}
