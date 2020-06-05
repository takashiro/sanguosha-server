import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class WuShuang extends Skill {
	constructor() {
		super('wushuang', [Tag.Compulsory]);
	}
}
