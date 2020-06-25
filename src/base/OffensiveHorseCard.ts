import { CardSubtype as Subtype } from '@karuta/sanguosha-core';
import HorseCard from './HorseCard';

class OffensiveHorseCard extends HorseCard {
	getSubtype(): Subtype {
		return Subtype.OffensiveHorse;
	}
}

export default OffensiveHorseCard;
