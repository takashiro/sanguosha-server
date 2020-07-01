import {
	SkillOwner,
	SkillTag as Tag,
} from '@karuta/sanguosha-core';

import GameDriver from '../../driver';
import GameEvent from '../../driver/GameEvent';

import Skill from '../Skill';
import Effect from './Effect';

export default abstract class MonadicSkill<ParamType> extends Skill {
	protected readonly event: GameEvent;

	protected readonly effect: Effect<ParamType>;

	constructor(owner: SkillOwner, name: string, event: GameEvent, tags?: Tag[]) {
		super(owner, name, tags);
		this.event = event;
		this.effect = new Effect<ParamType>(this, this.event, this.hasTag(Tag.Compulsory));
	}

	getDriver(): GameDriver | null {
		return this.effect.getDriver();
	}

	getEffects(): Effect<ParamType>[] {
		return [this.effect];
	}

	abstract isTriggerable(param: ParamType): boolean;

	abstract process(param: ParamType): Promise<boolean>;
}
