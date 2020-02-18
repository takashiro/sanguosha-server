import { General } from '@karuta/sanguosha-core';

import Collection from '../../driver/Collection';
import Card from '../../driver/Card';

import wei from './list/wei';
import shu from './list/shu';
import wu from './list/wu';
import qun from './list/qun';

import basic from './list/basic';
import equip from './list/equip';
import trick from './list/trick';

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
			...basic(),
			...equip(),
			...trick(),
		];
	}
}
