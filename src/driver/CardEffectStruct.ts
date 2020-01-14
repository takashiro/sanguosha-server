import CardUseStruct from './CardUseStruct';
import ServerPlayer from './ServerPlayer';

class CardEffectStruct {
	use: CardUseStruct;

	to: ServerPlayer;

	/**
	 * @param use
	 * @param to
	 */
	constructor(use: CardUseStruct, to: ServerPlayer) {
		this.use = use;
		this.to = to;
	}

	get from(): ServerPlayer {
		return this.use.from;
	}
}

export default CardEffectStruct;
