import {
	Card,
	DamageType,
	Skill,
} from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

class DamageStruct {
	from: ServerPlayer;

	to: ServerPlayer;

	num: number;

	type: DamageType;

	skill: Skill | undefined;

	card: Card | undefined;

	constructor(from: ServerPlayer, to: ServerPlayer, num = 1) {
		this.from = from;
		this.to = to;
		this.num = num;
		this.type = DamageType.Normal;
	}
}

export default DamageStruct;
