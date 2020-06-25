import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class KuRou extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'kurou');
	}
}
