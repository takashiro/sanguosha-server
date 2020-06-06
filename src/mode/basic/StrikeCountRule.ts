import { PlayerPhase as Phase } from '@karuta/sanguosha-core';

import CardUse from '../../driver/CardUse';
import GameEvent from '../../driver/GameEvent';
import AbstractStrikeRule from './AbstractStrikeRule';

class StrikeCountRule extends AbstractStrikeRule<CardUse> {
	constructor() {
		super(GameEvent.SelectingCardTargets);
	}

	isTriggerable(use: CardUse): boolean {
		if (!use.card || !this.isStrike(use.card)) {
			return false;
		}

		const { from } = use;
		return from.isAlive() && from.getPhase() === Phase.Play;
	}

	async process(use: CardUse): Promise<boolean> {
		const { from } = use;
		from.addUseCount('strike', 1);
		return false;
	}
}

export default StrikeCountRule;
