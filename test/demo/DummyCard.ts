import {
	CardType as Type,
	CardSubtype as Subtype,
} from '@karuta/sanguosha-core';
import { Card } from '@karuta/sanguosha-pack';

export default class DummyCard extends Card {
	getType(): Type {
		return Type.Basic;
	}

	getSubtype(): Subtype {
		return Subtype.None;
	}
}
