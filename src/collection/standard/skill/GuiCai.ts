import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class GuiCai extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'guicai');
	}
}
