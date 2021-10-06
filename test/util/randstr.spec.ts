import randstr from '../../src/util/randstr';

it('generates a random string', () => {
	const str = randstr(20);
	expect(str).toHaveLength(20);
});
