import { Card, CardSuit, CardColor } from '@karuta/sanguosha-core';
import CardPattern from '../src/core/CardPattern';

const strike = new Card('strike', CardSuit.Heart, 2);
const peach = new Card('peach', CardSuit.Club, 3);

it('matches card name', () => {
	const pattern = new CardPattern({
		name: 'strike',
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});

it('matches card name postfix', () => {
	const pattern = new CardPattern({
		namePostfix: 'ike',
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});

it('matches card suit', () => {
	const pattern = new CardPattern({
		suits: [CardSuit.Heart],
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});

it('matches card color', () => {
	const pattern = new CardPattern({
		colors: [CardColor.Red],
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});

it('matches card number', () => {
	const pattern = new CardPattern({
		numbers: [2, 4],
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});

it('matches card number range', () => {
	const pattern = new CardPattern({
		numberRange: {
			from: 1,
			to: 2,
		},
	});
	expect(pattern.match(strike)).toBe(true);
	expect(pattern.match(peach)).toBe(false);
});
