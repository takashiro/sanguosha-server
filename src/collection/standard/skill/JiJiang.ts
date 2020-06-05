import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class JiJiang extends Skill {
	constructor() {
		super('jijiang', [Tag.Lord]);
	}
}
