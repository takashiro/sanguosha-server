import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class HuJia extends Skill {
	constructor() {
		super('hujia', [Tag.Lord]);
	}
}
