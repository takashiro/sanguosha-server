import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

import CardDraw from '../../../../driver/CardDraw';
import GameEvent from '../../../../driver/GameEvent';
import ServerPlayer from '../../../../driver/ServerPlayer';
import SkillEffect from '../../../../base/SkillEffect';
import LuoYi from '.';

export default class LuoYiDraw extends SkillEffect<CardDraw> {
	constructor(skill: LuoYi) {
		super(skill, GameEvent.DrawingNCards);
	}

	isTriggerable(draw: CardDraw): boolean {
		return draw.player === this.getOwner() && draw.num > 0 && draw.player.getPhase() === Phase.Draw;
	}

	getInvoker(draw: CardDraw): ServerPlayer {
		return draw.player;
	}

	async process(draw: CardDraw): Promise<boolean> {
		draw.num--;
		const skill = this.skill as LuoYi;
		skill.setEffectiveRound(draw.player.getRound());
		return false;
	}
}
