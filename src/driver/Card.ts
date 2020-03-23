import { Card as MetaCard } from '@karuta/sanguosha-core';

import GameDriver from './GameDriver';
import ServerPlayer from './ServerPlayer';
import CardUse from './CardUse';
import CardEffectStruct from './CardEffectStruct';

abstract class Card extends MetaCard {
	/**
	 * Check if the selected players are feasible
	 * @param driver game driver
	 * @param selected Selected players
	 * @param source The user using this card
	 * @return Whether this selection is feasible
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async targetFeasible(driver: GameDriver, selected: ServerPlayer[], source: ServerPlayer): Promise<boolean> {
		return true;
	}

	/**
	 * Check if toSelect is a valid target
	 * @param driver game driver
	 * @param selected Selected players
	 * @param toSelect The player to be selected
	 * @param source The player selecting targets
	 * @return Whether the current player is selectable
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async targetFilter(driver: GameDriver, selected: ServerPlayer[], toSelect: ServerPlayer, source: ServerPlayer): Promise<boolean> {
		return !!toSelect;
	}

	/**
	 * Check if this card can be used
	 * @param driver game driver
	 * @param source The player using this card
	 * @return Whether this card can be used
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	async isAvailable(driver: GameDriver, source: ServerPlayer): Promise<boolean> {
		return false;
	}

	/**
	 * The first procedure of using a card
	 * @param driver
	 * @param use
	 */
	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	async onUse(driver: GameDriver, use: CardUse): Promise<void> {
	}

	/**
	 * The second procedure of using a card
	 * @param driver
	 * @param use
	 */
	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	async use(driver: GameDriver, use: CardUse): Promise<void> {
	}

	/**
	 * This function will be called on every target before effect()
	 * @param driver
	 * @param effect
	 */
	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	async onEffect(driver: GameDriver, effect: CardEffectStruct): Promise<void> {
	}

	/**
	 * This function will be called on every target after use()
	 * @param driver
	 * @param effect
	 */
	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	async effect(driver: GameDriver, effect: CardEffectStruct): Promise<void> {
	}

	/**
	 * This function will be called after effect() has been executed on every target
	 * @param driver
	 * @param use
	 */
	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	async complete(driver: GameDriver, use: CardUse): Promise<void> {
	}
}

export default Card;
