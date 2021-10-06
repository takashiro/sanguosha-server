import CollectionLoader from '../../src/driver/CollectionLoader';

describe('Error Handling', () => {
	const loader = new CollectionLoader();

	it('throws an error if module is not found', async () => {
		await expect(() => loader.get('1qaz')).rejects.toThrowError(/^Cannot find module '1qaz' from '.*'/);
	});

	it('rejects invalid game module', async () => {
		await expect(() => loader.get('jest')).rejects.toThrowError('jest is not a valid game pack.');
	});
});
