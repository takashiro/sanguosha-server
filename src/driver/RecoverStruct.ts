import {
	Card,
	Skill,
} from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

export default class RecoverStruct {
	from: ServerPlayer;

	to: ServerPlayer;

	num: number;

	skill?: Skill;

	card?: Card;

	constructor(from: ServerPlayer, to: ServerPlayer, num: number) {
		this.from = from;
		this.to = to;
		this.num = num;
	}
}
