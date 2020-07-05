import Skill from '../../../../base/Skill';
import SkillEffect from '../../../../base/SkillEffect';
import GameEvent from '../../../../driver/GameEvent';
import Judgement from '../../../../driver/Judgement';
import ServerPlayer from '../../../../driver/ServerPlayer';

export default class LuoShenMove extends SkillEffect<Judgement> {
	constructor(skill: Skill) {
		super(skill, GameEvent.AfterIssuingJudgement);
		this.compulsory = true;
	}

	getInvoker(judgement: Judgement): ServerPlayer {
		return judgement.player;
	}

	isTriggerable(judgement: Judgement): boolean {
		return judgement.origin === this.skill.getName() && judgement.isEffective();
	}

	async process(): Promise<boolean> {
		return true;
	}
}
