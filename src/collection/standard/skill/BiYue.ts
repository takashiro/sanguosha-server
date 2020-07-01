import {
	SkillOwner,
	PlayerPhase as Phase,
} from '@karuta/sanguosha-core';

import MonadicSkill from '../../../base/MonadicSkill';
import GameEvent from '../../../driver/GameEvent';
import PhaseChange from '../../../driver/PhaseChange';

export default class BiYue extends MonadicSkill<PhaseChange> {
	constructor(owner: SkillOwner) {
		super(owner, 'biyue', GameEvent.ProceedingPhase);
	}

	isTriggerable(change: PhaseChange): boolean {
		return change.to === Phase.End && change.player === this.getOwner();
	}

	async process(change: PhaseChange): Promise<boolean> {
		const { player } = change;
		const driver = this.getDriver();
		await driver?.drawCards(player, 1);
		return false;
	}
}
