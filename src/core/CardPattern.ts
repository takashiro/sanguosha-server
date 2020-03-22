import {
	Card,
	CardSuit as Suit,
	CardColor as Color,
} from '@karuta/sanguosha-core';

interface NumberRange {
	from: number;
	to: number;
}

interface CardPatternProps {
	name?: string;
	namePostfix?: string;
	suits?: Suit[];
	colors?: Color[];
	numbers?: number[];
	numberRange?: NumberRange;
}

export default class CardPattern {
	protected name?: string;

	protected namePostfix?: string;

	protected suits?: Suit[];

	protected colors?: Color[];

	protected numbers?: number[];

	protected numberRange?: NumberRange;

	constructor(props: CardPatternProps) {
		this.name = props.name;
		this.namePostfix = props.namePostfix;
		this.suits = props.suits;
		this.colors = props.colors;
		this.numbers = props.numbers;
		this.numberRange = props.numberRange;
	}

	match(card: Card): boolean {
		if (this.name && this.name !== card.getName()) {
			return false;
		}

		if (this.namePostfix && !card.getName().endsWith(this.namePostfix)) {
			return false;
		}

		if (this.suits && !this.suits.includes(card.getSuit())) {
			return false;
		}

		if (this.colors && !this.colors.includes(card.getColor())) {
			return false;
		}

		const number = card.getNumber();
		if (this.numbers && !this.numbers.includes(number)) {
			return false;
		}

		if (this.numberRange && !(this.numberRange.from <= number && number <= this.numberRange.to)) {
			return false;
		}

		return true;
	}
}
