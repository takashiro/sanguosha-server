import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class XiaoJi extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'xiaoji');
	}
}
