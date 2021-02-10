import fs from 'fs';
import path from 'path';
import { Collection } from '@karuta/sanguosha-pack';

type CollectionCreator = new() => Collection;

export default class CollectionLoader {
	protected collections: Map<string, CollectionCreator> = new Map();

	async get(name: string): Promise<CollectionCreator | undefined> {
		let col = this.collections.get(name);
		if (col) {
			return col;
		}

		try {
			col = await this.load(name);
		} catch (error) {
			// Ignore
		}
		return col;
	}

	protected async load(name: string): Promise<CollectionCreator> {
		let modulePath = require.resolve(name);
		if (!modulePath) {
			throw new Error(`${name} cannot be resolved`);
		}

		const moduleName = path.basename(name);
		while (path.basename(modulePath) !== moduleName) {
			const newPath = path.dirname(modulePath);
			if (newPath === modulePath) {
				throw new Error(`Failed to find module path of ${moduleName}`);
			}
			modulePath = newPath;
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
