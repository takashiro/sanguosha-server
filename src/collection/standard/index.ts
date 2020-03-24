import { General } from '@karuta/sanguosha-core';

import Collection from '../../driver/Collection';
import Card from '../../driver/Card';

import wei from './wei';
import shu from './shu';
import wu from './wu';
import qun from './qun';

import createBasicCards from './basic-cards';
import createEquipCards from './equip-cards';
import createTrickCards from './trick-cards';

export default class StandardCollection extends Collection {
	constructor() {
		super('standard');
	}

	getGenerals(): General[] {
		return [
			...wei,
			...shu,
			...wu,
			...qun,
		];
	}

	createCards(): Card[] {
		return [
			...createBasicCards(),
			...createEquipCards(),
			...createTrickCards(),
		];
	}
}
