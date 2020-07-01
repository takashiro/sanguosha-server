import ServerPlayer from '../../driver/ServerPlayer';
import GameEvent from '../../driver/GameEvent';
import SkillEffect from '../SkillEffect';
import MonadicSkill from '.';

export default class MonadicSkillEffect<ParamType> extends SkillEffect<ParamType> {
	constructor(skill: MonadicSkill<ParamType>, event: GameEvent, compulsory: boolean) {
		super(skill, event);
		this.compulsory = compulsory;
	}

	getSkill(): MonadicSkill<ParamType> {
		return this.skill as MonadicSkill<ParamType>;
	}

	getInvoker(): ServerPlayer {
		return this.skill.getOwner() as ServerPlayer;
	}

	isTriggerable(param: ParamType): boolean {
		const skill = this.getSkill();
		return super.isTriggerable(param) && skill.isTriggerable(param);
	}

	process(param: ParamType): Promise<boolean> {
		const skill = this.getSkill();
		return skill.process(param);
	}
}
