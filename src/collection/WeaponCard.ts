import { CardSubtype as Subtype } from '@karuta/sanguosha-core';
import EquipCard from './EquipCard';

class WeaponCard extends EquipCard {
	getSubtype(): Subtype {
		return Subtype.Weapon;
	}
}

export default WeaponCard;
