import {
	CardAction,
	CardPattern,
} from '@karuta/sanguosha-pack';

interface CardOption {
	action: CardAction;
	minNum: number;
	maxNum: number;
	autoSkip?: boolean;
	pattern?: CardPattern;
}

export default CardOption;
