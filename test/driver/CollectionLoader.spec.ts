import fs from 'fs';

import CollectionLoader from '../../src/driver/CollectionLoader';

describe('Normal Case', () => {
	let readFile: jest.SpyInstance<Promise<string | Buffer>>;

	beforeAll(() => {
		readFile = jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(JSON.stringify({
			dependencies: {
				'@karuta/sanguosha-pack': '^1.0.0',
			},
		}));
	});

	const loader = new CollectionLoader();

	it('loads a valid module', async () => {
		const col = await loader.get('jest');
		expect(col).toBeTruthy();
	});

	it('caches loaded modules', async () => {
		const col = await loader.get('jest');
		expect(col).toBeTruthy();
	});

	afterAll(() => {
		readFile.mockRestore();
	});
});

describe('Error Handling', () => {
	const loader = new CollectionLoader();

	it('throws an error if module is not found', async () => {
		await expect(() => loader.get('1qaz')).rejects.toThrowError(/^Cannot find module '1qaz' from '.*'/);
	});

	it('rejects invalid game module', async () => {
		await expect(() => loader.get('jest')).rejects.toThrowError('jest is not a valid game pack.');
	});
});
