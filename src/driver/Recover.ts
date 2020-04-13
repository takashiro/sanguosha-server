import {
	Card,
	Skill,
	RecoverStruct,
} from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

export default class Recover {
	from?: ServerPlayer;

	to: ServerPlayer;

	num: number;

	skill?: Skill;

	card?: Card;

	constructor(from: ServerPlayer | undefined, to: ServerPlayer, num: number) {
		this.from = from;
		this.to = to;
		this.num = num;
	}

	toJSON(): RecoverStruct {
		return {
			from: this.from && this.from.getSeat(),
			to: this.to.getSeat(),
			num: this.num,
			skill: this.skill && this.skill.getName(),
			card: this.card && this.card.toJSON(),
		};
	}
}
