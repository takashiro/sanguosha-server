import { CardSuit as Suit } from '@karuta/sanguosha-core';

import * as std from '../trick-card';
import Card from '../../../driver/Card';

function createTrickCards(): Card[] {
	return [
		new std.Harvest(Suit.Heart, 3),
		new std.Harvest(Suit.Heart, 4),
		new std.PeachGarden(Suit.Heart, 1),
		new std.BarbarianInvasion(Suit.Spade, 7),
		new std.BarbarianInvasion(Suit.Spade, 13),
		new std.BarbarianInvasion(Suit.Club, 7),
		new std.ArrowBarrage(Suit.Heart, 1),
		new std.Duel(Suit.Spade, 1),
		new std.Duel(Suit.Club, 1),
		new std.Duel(Suit.Diamond, 1),
		new std.ExNihilo(Suit.Heart, 7),
		new std.ExNihilo(Suit.Heart, 8),
		new std.ExNihilo(Suit.Heart, 9),
		new std.ExNihilo(Suit.Heart, 11),
		new std.Snatch(Suit.Spade, 3),
		new std.Snatch(Suit.Spade, 4),
		new std.Snatch(Suit.Spade, 11),
		new std.Snatch(Suit.Diamond, 3),
		new std.Snatch(Suit.Diamond, 4),
		new std.Dismantle(Suit.Spade, 3),
		new std.Dismantle(Suit.Spade, 4),
		new std.Dismantle(Suit.Spade, 12),
		new std.Dismantle(Suit.Club, 3),
		new std.Dismantle(Suit.Club, 4),
		new std.Dismantle(Suit.Heart, 12),
		new std.BorrowSword(Suit.Club, 12),
		new std.BorrowSword(Suit.Club, 13),
		new std.Nullification(Suit.Spade, 11),
		new std.Nullification(Suit.Club, 12),
		new std.Nullification(Suit.Club, 13),
		new std.Indulgence(Suit.Spade, 6),
		new std.Indulgence(Suit.Club, 6),
		new std.Indulgence(Suit.Heart, 6),
		new std.Lightning(Suit.Spade, 1),
	];
}

export default createTrickCards;
