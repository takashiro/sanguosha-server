import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class KeJi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'keji');
	}
}
