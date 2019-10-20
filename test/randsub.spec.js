const assert = require('assert');
const randsub = require('../src/util/randsub');

describe('Util - randsub()', function () {
	it('returns the array if num >= its length', function () {
		const arr = [1, 2, 3];
		const output1 = randsub(arr, 3);
		assert(output1 === arr);
		const output2 = randsub(arr, 4);
		assert(output2 === arr);
	});

	it('returns an empty array if num <= 0', function () {
		const arr = [4, 5, 6];
		const output1 = randsub(arr, 0);
		assert(output1.length === 0);
		const output2 = randsub(arr, -10);
		assert(output2.length === 0);
	});

	it('returns a subarray', function () {
		const arr = [];
		for (let i = 0; i < 5; i++) {
			arr.push(Math.floor(Math.random() * 0xFFFFFF));
		}

		for (let num = 1; num < 3; num++) {
			const output = randsub(arr, 1);
			for (const value of output) {
				assert(arr.includes(value));
			}
		}
	});
});
