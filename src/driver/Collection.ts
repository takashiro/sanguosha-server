import { General } from '@karuta/sanguosha-core';
import Card from './Card';

abstract class Collection {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	abstract getGenerals(): General[];

	abstract createCards(): Card[];
}

export default Collection;
