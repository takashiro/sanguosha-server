import { PlayerPhase } from '@karuta/sanguosha-core';
import ServerPlayer from './ServerPlayer';

interface PhaseChangeStruct {
	player: ServerPlayer;
	from: PlayerPhase;
	to: PlayerPhase;
}

export default PhaseChangeStruct;
