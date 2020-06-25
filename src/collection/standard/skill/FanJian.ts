import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class FanJian extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'fanjian');
	}
}
