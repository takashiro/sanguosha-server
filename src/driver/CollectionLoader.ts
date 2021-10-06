import fs from 'fs';
import path from 'path';
import { Collection } from '@karuta/sanguosha-pack';

type CollectionCreator = new() => Collection;

export default class CollectionLoader {
	protected collections: Map<string, CollectionCreator> = new Map();

	async get(name: string): Promise<CollectionCreator> {
		let col = this.collections.get(name);
		if (col) {
			return col;
		}

		col = await this.load(name);
		this.collections.set(name, col);

		return col;
	}

	protected async load(name: string): Promise<CollectionCreator> {
		let modulePath = require.resolve(name);

		while (!fs.existsSync(path.join(modulePath, 'package.json'))) {
			modulePath = path.dirname(modulePath);
		}

		const pkgPath = path.join(modulePath, 'package.json');
		const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
		const { dependencies } = pkg;
		if (!dependencies['@karuta/sanguosha-pack']) {
			throw new Error(`${name} is not a valid game pack.`);
		}

		// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
		const module = require(name);
		const col = module.default || module;
		this.collections.set(name, col);
		return col;
	}
}

export const loader = new CollectionLoader();
