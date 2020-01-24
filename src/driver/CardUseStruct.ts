import Card from './Card';
import ServerPlayer from './ServerPlayer';

interface CardUseMeta {
	from: number;
	card: {
		id: number;
		name: string;
		suit: number;
		number: number;
	};
	to: number[] | undefined;
}

class CardUseStruct {
	from: ServerPlayer;

	card: Card;

	to: ServerPlayer[];

	constructor(from: ServerPlayer, card: Card, to?: ServerPlayer[]) {
		this.from = from;
		this.card = card;
		this.to = to || [];
	}

	toJSON(): CardUseMeta {
		return {
			from: this.from.getSeat(),
			card: this.card.toJSON(),
			to: this.to.length > 0 ? this.to.map((player) => player.getSeat()) : undefined,
		};
	}
}

export default CardUseStruct;
