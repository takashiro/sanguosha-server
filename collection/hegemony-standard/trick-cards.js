
const Suit = require('../../core/Card/Suit');

const std = require('../standard/trick-card');
const mnv = require('../maneuvering/card');

const TrickCard = require('../TrickCard');

class HegNullification extends TrickCard {

	constructor(suit, number) {
		super('heg-nullification', suit, number);
	}

}

class Ease extends TrickCard {

	constructor(suit, number) {
		super('ease', suit, number);
	}

}

class Scout extends TrickCard {

	constructor(suit, number) {
		super('scout', suit, number);
	}

}

class Ally extends TrickCard {

	constructor(suit, number) {
		super('ally', suit, number);
	}

}

module.exports = function () { return [
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
	new std.Nullification(Suit.Spade, 11),
	new HegNullification(Suit.Club, 13),
	new HegNullification(Suit.Diamond, 12),
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
]; };
