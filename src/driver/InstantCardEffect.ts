import CardEffect from './CardEffect';
import CardUse from './CardUse';
import ServerPlayer from './ServerPlayer';

export default class InstantCardEffect extends CardEffect {
	readonly use: CardUse;

	constructor(use: CardUse, to: ServerPlayer | CardEffect) {
		super(use.card, to);
		this.use = use;
	}

	get from(): ServerPlayer {
		return this.use.from;
	}
}
