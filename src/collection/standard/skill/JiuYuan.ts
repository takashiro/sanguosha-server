import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class JiuYuan extends Skill {
	constructor() {
		super('jiuyuan', [Tag.Lord, Tag.Compulsory]);
	}
}
