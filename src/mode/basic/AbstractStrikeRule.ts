import { Card } from '@karuta/sanguosha-core';

import GameRule from '../../driver/GameRule';

export default class AbstractStrikeRule<ParamType> extends GameRule<ParamType> {
	protected isStrike(card: Card): boolean {
		const name = card.getName();
		return name === 'strike' || name.endsWith('-strike');
	}
}
