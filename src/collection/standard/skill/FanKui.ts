import { SkillOwner } from '@karuta/sanguosha-core';

import CardAction from '../../../core/CardAction';
import Damage from '../../../driver/Damage';
import GameEvent from '../../../driver/GameEvent';
import MonadicSkill from '../../../base/MonadicSkill';

export default class FanKui extends MonadicSkill<Damage> {
	constructor(owner: SkillOwner) {
		super(owner, 'fankui', GameEvent.AfterDamaged);
	}

	isTriggerable(damage: Damage): boolean {
		if (!damage.from) {
			return false;
		}
		return damage.from.isAlive() && damage.to === this.getOwner();
	}

	async process(damage: Damage): Promise<boolean> {
		const driver = this.getDriver();
		const { from } = damage;
		if (!driver || !from) {
			return false;
		}

		const areas = [
			from.getHandArea(),
			from.getEquipArea(),
		];
		const { to } = damage;
		const cards = await to.askForCards(areas, {
			action: CardAction.Obtain,
			minNum: 1,
			maxNum: 1,
		});
		if (cards.length > 0) {
			await driver.moveCards(cards, to.getHandArea(), { openTo: [from, to] });
		}
		return false;
	}
}
