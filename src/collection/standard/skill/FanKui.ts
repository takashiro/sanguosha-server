import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class FanKui extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'fankui');
	}
}
