import { CardType as Type } from '@karuta/sanguosha-core';

import Card from '../driver/Card';

class TrickCard extends Card {
	getType(): Type {
		return Type.Trick;
	}
}

export default TrickCard;
