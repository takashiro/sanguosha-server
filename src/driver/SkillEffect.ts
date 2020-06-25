import {
	Skill,
	SkillOwner,
} from '@karuta/sanguosha-core';

import EventListener from './EventListener';
import GameEvent from './GameEvent';

export default abstract class SkillEffect<ParamType> extends EventListener<GameEvent, ParamType> {
	protected readonly skill: Skill;

	constructor(skill: Skill, event: GameEvent) {
		super(event);
		this.skill = skill;
	}

	getSkill(): Skill {
		return this.skill;
	}

	getOwner(): SkillOwner {
		return this.skill.getOwner();
	}
}
