import { CardSuit as Suit } from '@karuta/sanguosha-core';

import Card from '../../driver/Card';

import * as std from '../standard/trick';
import * as mnv from '../maneuvering/trick';

import HegNullify from './trick/HegNullify';
import Ease from './trick/Ease';
import Scout from './trick/Scout';
import Ally from './trick/Ally';

export default function createTrickCards(): Card[] {
	return [
		new std.Harvest(Suit.Heart, 3),
		new std.PeachGarden(Suit.Heart, 1),
		new std.BarbarianInvasion(Suit.Spade, 13),
		new std.BarbarianInvasion(Suit.Club, 7),
		new std.ArrowBarrage(Suit.Heart, 1),
		new std.Duel(Suit.Spade, 1),
		new std.Duel(Suit.Club, 1),
		new std.ExNihilo(Suit.Heart, 7),
		new std.ExNihilo(Suit.Heart, 8),
		new std.Snatch(Suit.Spade, 3),
		new std.Snatch(Suit.Spade, 4),
		new std.Snatch(Suit.Diamond, 3),
		new std.Dismantle(Suit.Spade, 3),
		new std.Dismantle(Suit.Spade, 4),
		new std.Dismantle(Suit.Heart, 12),
		new mnv.IronChain(Suit.Spade, 12),
		new mnv.IronChain(Suit.Club, 12),
		new mnv.IronChain(Suit.Club, 13),
		new mnv.FireAttack(Suit.Heart, 2),
		new mnv.FireAttack(Suit.Heart, 3),
		new std.BorrowSword(Suit.Club, 12),
		new std.Nullify(Suit.Spade, 11),
		new HegNullify(Suit.Club, 13),
		new HegNullify(Suit.Diamond, 12),
		new Ease(Suit.Heart, 11),
		new Ease(Suit.Diamond, 4),
		new Scout(Suit.Club, 3),
		new Scout(Suit.Club, 4),
		new Ally(Suit.Heart, 9),
		new std.Indulgence(Suit.Club, 6),
		new std.Indulgence(Suit.Heart, 6),
		new mnv.SupplyShortage(Suit.Spade, 10),
		new mnv.SupplyShortage(Suit.Club, 10),
		new std.Lightning(Suit.Spade, 1),
	];
}
