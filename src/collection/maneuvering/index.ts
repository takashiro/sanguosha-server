import { General } from '@karuta/sanguosha-core';

import Collection from '../../driver/Collection';
import Card from '../../driver/Card';

export default class ManeuveringCollection extends Collection {
	constructor() {
		super('maneuvering');
	}

	getGenerals(): General[] {
		return [];
	}

	createCards(): Card[] {
		// TO-DO: Add cards
		return [];
	}
}
