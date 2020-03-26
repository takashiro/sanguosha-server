import { CardType as Type } from '@karuta/sanguosha-core';

import Card from '../driver/Card';

abstract class EquipCard extends Card {
	getType(): Type {
		return Type.Equip;
	}
}

export default EquipCard;
