import { PlayerPhase } from '@karuta/sanguosha-core';
import ServerPlayer from './ServerPlayer';

class PhaseChange {
	player: ServerPlayer;

	from: PlayerPhase;

	to: PlayerPhase;

	constructor(player: ServerPlayer, from: PlayerPhase, to: PlayerPhase) {
		this.player = player;
		this.from = from;
		this.to = to;
	}
}

export default PhaseChange;
