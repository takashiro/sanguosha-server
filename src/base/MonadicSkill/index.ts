import { SkillOwner, SkillTag } from '@karuta/sanguosha-core';

import Skill from '../../driver/Skill';
import GameEvent from '../../driver/GameEvent';

import Effect from './Effect';

export default abstract class MonadicSkill<ParamType> extends Skill {
	protected readonly event: GameEvent;

	protected readonly effect: Effect<ParamType>;

	constructor(owner: SkillOwner, name: string, event: GameEvent, tags: SkillTag[]) {
		super(owner, name, tags);
		this.event = event;
		this.effect = new Effect<ParamType>(this, this.event);
	}

	getEffects(): Effect<ParamType>[] {
		return [this.effect];
	}

	abstract isTriggerable(param: ParamType): boolean;

	abstract process(param: ParamType): Promise<boolean>;
}
