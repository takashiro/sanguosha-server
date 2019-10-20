
const assert = require('assert');
const randsub = require('../src/util/randsub');

describe('randsub', function () {
	const arr = [];
	for (let i = 0; i < 10; i++) {
		arr.push(Math.floor(Math.random() * 0xFFFF));
	}

	it('choose 2 elements by random', function () {
		const res = randsub(arr, 2);
		assert(res.length === 2);
		for (const num of res) {
			assert(arr.indexOf(num) >= 0);
		}
	});
});
