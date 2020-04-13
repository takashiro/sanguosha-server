import {
	Card,
	DamageStruct,
	DamageType,
	Skill,
} from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

class Damage {
	from?: ServerPlayer;

	to: ServerPlayer;

	num: number;

	type: DamageType;

	skill?: Skill;

	card?: Card;

	constructor(from: ServerPlayer | undefined, to: ServerPlayer, num: number) {
		this.from = from;
		this.to = to;
		this.num = num;
		this.type = DamageType.Normal;
	}

	toJSON(): DamageStruct {
		return {
			from: this.from ? this.from.getSeat() : undefined,
			to: this.to.getSeat(),
			num: this.num,
			type: this.type,
		};
	}
}

export default Damage;
