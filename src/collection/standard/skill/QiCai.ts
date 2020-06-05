import {
	Skill,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

export default class QiCai extends Skill {
	constructor() {
		super('qicai', [Tag.Compulsory]);
	}
}
