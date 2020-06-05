import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class QianXun extends Skill {
	constructor() {
		super('qianxun', [Tag.Compulsory]);
	}
}
