import CardAction from '../core/CardAction';
import CardPattern from '../core/CardPattern';

interface CardOption {
	action: CardAction;
	minNum: number;
	maxNum: number;
	autoSkip?: boolean;
	pattern?: CardPattern;
}

export default CardOption;
