import {
	CardSubtype as Subtype,
} from '@karuta/sanguosha-core';

import TrickCard from './TrickCard';

class DelayedTrickCard extends TrickCard {
	getSubtype(): Subtype {
		return Subtype.DelayedTrick;
	}
}

export default DelayedTrickCard;
