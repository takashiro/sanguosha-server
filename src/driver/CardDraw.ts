import { CardDrawStruct } from '@karuta/sanguosha-core';

import ServerPlayer from './ServerPlayer';

class CardDraw {
	player: ServerPlayer;

	num: number;

	constructor(player: ServerPlayer, num: number) {
		this.player = player;
		this.num = num;
	}

	toJSON(): CardDrawStruct {
		return {
			player: this.player.getSeat(),
			num: this.num,
		};
	}
}

export default CardDraw;
