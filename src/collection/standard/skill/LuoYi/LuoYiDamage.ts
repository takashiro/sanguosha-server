import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

import SkillEffect from '../../../../base/SkillEffect';
import Damage from '../../../../driver/Damage';
import GameEvent from '../../../../driver/GameEvent';
import ServerPlayer from '../../../../driver/ServerPlayer';
import LuoYi from '.';

export default class LuoYiDamage extends SkillEffect<Damage> {
	constructor(skill: LuoYi) {
		super(skill, GameEvent.Damaging);
		this.compulsory = true;
	}

	isTriggerable(damage: Damage): boolean {
		const { from } = damage;
		if (!from || from !== this.getOwner()) {
			return false;
		}

		const { card } = damage;
		if (!card) {
			return false;
		}

		const cardName = card.getName();
		if (cardName !== 'duel' && !cardName.endsWith('strike')) {
			return false;
		}

		const skill = this.skill as LuoYi;
		if (from.getPhase() === Phase.Inactive || skill.getEffectiveRound() !== from.getRound()) {
			return false;
		}

		return true;
	}

	getInvoker(damage: Damage): ServerPlayer {
		return damage.from as ServerPlayer;
	}

	async process(damage: Damage): Promise<boolean> {
		damage.num++;
		return false;
	}
}
