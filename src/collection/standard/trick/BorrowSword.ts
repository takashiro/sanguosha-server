import {
	CardSubtype as Subtype,
	CardSuit as Suit,
} from '@karuta/sanguosha-core';

import InstantTrickCard from '../../InstantTrickCard';
import GameDriver from '../../../driver';
import ServerPlayer from '../../../driver/ServerPlayer';
import CardUse from '../../../driver/CardUse';
import CardEffect from '../../../driver/CardEffect';
import CardAction from '../../../core/CardAction';
import CardPattern from '../../../core/CardPattern';
import Card from '../../../driver/Card';

class BorrowSword extends InstantTrickCard {
	protected victim?: ServerPlayer;

	constructor(suit: Suit, number: number) {
		super('borrow-sword', suit, number);
	}

	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		const others = driver.getAlivePlayersExcept(source);
		const victims = driver.getAlivePlayers();
		for (const other of others) {
			const equipArea = other.getEquipArea();
			if (!equipArea.find((card) => card.getSubtype() === Subtype.Weapon)) {
				continue;
			}

			for (const victim of victims) {
				if (await driver.isInAttackRange(other, victim)) {
					return true;
				}
			}
		}

		return false;
	}

	async targetFeasible(driver: GameDriver, selected: ServerPlayer[]): Promise<boolean> {
		return selected.length === 2;
	}

	async targetFilter(driver: GameDriver, selected: ServerPlayer[], toSelect: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		if (selected.length <= 0) {
			if (toSelect === source) {
				return false;
			}

			const equipArea = toSelect.getEquipArea();
			const weapon = equipArea.find((card) => card.getSubtype() === Subtype.Weapon);
			return Boolean(weapon);
		}

		if (selected.length === 1) {
			const [attacker] = selected;
			const inRange = await driver.isInAttackRange(attacker, toSelect);
			return inRange;
		}

		return false;
	}

	async onUse(driver: GameDriver, use: CardUse): Promise<void> {
		const { to } = use;
		if (to.length === 2) {
			[, this.victim] = to;
			to.splice(1, 1);
		}
	}

	async effect(driver: GameDriver, effect: CardEffect): Promise<void> {
		const { to } = effect;
		if (!to || to.isDead() || !this.victim) {
			return;
		}

		const { victim } = this;
		delete this.victim;

		const cards = await to.askForCards([to.getHandArea()], {
			action: CardAction.Use,
			minNum: 0,
			maxNum: 1,
			pattern: new CardPattern({ namePostfix: 'strike' }),
		});

		if (!cards || cards.length <= 0) {
			const equipArea = to.getEquipArea();
			const weapon = equipArea.find((card) => card.getSubtype() === Subtype.Weapon);
			if (weapon && effect.from && effect.from.isAlive()) {
				await driver.moveCards([weapon], effect.from.getHandArea(), { open: true });
			}
		} else {
			const use = new CardUse(to, cards[0] as Card, [victim]);
			await driver.useCard(use);
		}
	}
}

export default BorrowSword;
