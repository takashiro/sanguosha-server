import { CardSubtype as Subtype } from '@karuta/sanguosha-core';
import EquipCard from './EquipCard';

class TreasureCard extends EquipCard {
	getSubtype(): Subtype {
		return Subtype.Treasure;
	}
}

export default TreasureCard;
