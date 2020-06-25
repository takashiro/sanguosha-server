import { CardSubtype as Subtype } from '@karuta/sanguosha-core';
import HorseCard from './HorseCard';

class DefensiveHorseCard extends HorseCard {
	getSubtype(): Subtype {
		return Subtype.DefensiveHorse;
	}
}

export default DefensiveHorseCard;
