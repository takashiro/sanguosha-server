import randsub from '../src/util/randsub';

describe('Util - randsub()', () => {
	it('returns the array if num >= its length', () => {
		const arr = [1, 2, 3];
		const output1 = randsub(arr, 3);
		expect(output1).toBe(arr);
		const output2 = randsub(arr, 4);
		expect(output2).toBe(arr);
	});

	it('returns an empty array if num <= 0', () => {
		const arr = [4, 5, 6];
		const output1 = randsub(arr, 0);
		expect(output1).toHaveLength(0);
		const output2 = randsub(arr, -10);
		expect(output2).toHaveLength(0);
	});

	it('returns a subarray', () => {
		const arr = [];
		for (let i = 0; i < 5; i++) {
			arr.push(Math.floor(Math.random() * 0xFFFFFF));
		}

		for (let num = 1; num < 3; num++) {
			const output = randsub(arr, 1);
			for (const value of output) {
				expect(arr).toContain(value);
			}
		}
	});
});
