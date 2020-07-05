import {
	SkillOwner,
	CardSuit as Suit,
} from '@karuta/sanguosha-core';

import CardPattern from '../../../core/CardPattern';
import CardAction from '../../../core/CardAction';
import Damage from '../../../driver/Damage';
import GameEvent from '../../../driver/GameEvent';
import Judgement from '../../../driver/Judgement';
import MonadicSkill from '../../../base/MonadicSkill';

export default class GangLie extends MonadicSkill<Damage> {
	constructor(owner: SkillOwner) {
		super(owner, 'ganglie', GameEvent.AfterDamaged);
	}

	isTriggerable(damage: Damage): boolean {
		return Boolean(damage.to) && damage.to === this.getOwner();
	}

	async process(damage: Damage): Promise<boolean> {
		const driver = this.getDriver();
		if (!driver) {
			return false;
		}

		const suits = [
			Suit.Spade,
			Suit.Club,
			Suit.Diamond,
		];
		const pattern = new CardPattern({ suits });
		const judgement = new Judgement(damage.to, this.getName(), pattern);
		await driver.judge(judgement);
		if (!judgement.isEffective()) {
			return false;
		}

		const { from } = damage;
		if (!from) {
			return false;
		}

		const handArea = from.getHandArea();
		const cards = handArea.size > 2 ? await from.askForCards([handArea], {
			action: CardAction.Discard,
			minNum: 2,
			maxNum: 2,
		}) : [];
		if (cards.length < 2) {
			const ganglie = new Damage(damage.to, from, 1);
			await driver.damage(ganglie);
		} else {
			await driver.moveCards(cards, driver.getDiscardPile(), { open: true });
		}

		return false;
	}
}
