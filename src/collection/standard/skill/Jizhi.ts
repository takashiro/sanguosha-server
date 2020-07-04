import {
	SkillOwner,
	CardType,
	CardSubtype,
} from '@karuta/sanguosha-core';

import MonadicSkill from '../../../base/MonadicSkill';
import CardUse from '../../../driver/CardUse';
import GameEvent from '../../../driver/GameEvent';

export default class JiZhi extends MonadicSkill<CardUse> {
	constructor(owner: SkillOwner) {
		super(owner, 'jizhi', GameEvent.UsingCard);
	}

	isTriggerable(use: CardUse): boolean {
		return use.from === this.getOwner() && use.card.getType() === CardType.Trick && use.card.getSubtype() === CardSubtype.InstantTrick;
	}

	async process(use: CardUse): Promise<boolean> {
		const { from } = use;
		const driver = this.getDriver();
		await driver?.drawCards(from, 1);
		return false;
	}
}
