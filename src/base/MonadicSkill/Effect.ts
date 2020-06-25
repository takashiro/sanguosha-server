import MonadicSkill from '.';
import SkillEffect from '../../driver/SkillEffect';

export default class MonadicSkillEffect<ParamType> extends SkillEffect<ParamType> {
	getSkill(): MonadicSkill<ParamType> {
		return this.skill as MonadicSkill<ParamType>;
	}

	isTriggerable(param: ParamType): boolean {
		const skill = this.getSkill();
		return skill.isTriggerable(param);
	}

	process(param: ParamType): Promise<boolean> {
		const skill = this.getSkill();
		return skill.process(param);
	}
}
