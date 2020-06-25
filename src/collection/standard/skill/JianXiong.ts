import { Skill, SkillOwner } from '@karuta/sanguosha-core';

export default class JianXiong extends Skill {
	constructor(owner: SkillOwner) {
		super(owner, 'jianxiong');
	}
}
