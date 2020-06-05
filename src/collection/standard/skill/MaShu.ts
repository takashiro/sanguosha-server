import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class MaShu extends Skill {
	constructor() {
		super('mashu', [Tag.Compulsory]);
	}
}
