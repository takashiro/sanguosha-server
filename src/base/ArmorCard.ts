import { CardSubtype as Subtype } from '@karuta/sanguosha-core';
import EquipCard from './EquipCard';

class ArmorCard extends EquipCard {
	getSubtype(): Subtype {
		return Subtype.Armor;
	}
}

export default ArmorCard;
