import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class KongCheng extends Skill {
	constructor() {
		super('kongcheng', [Tag.Compulsory]);
	}
}
