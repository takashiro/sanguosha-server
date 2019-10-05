
const Suit = require('../../core/Card/Suit');
const std = require('../standard/equip-card');
const mnv = require('../maneuvering/card');

const WeaponCard = require('../WeaponCard');
const DefensiveHorseCard = require('../DefensiveHorseCard');
const OffensiveHorseCard = require('../OffensiveHorseCard');

class WuliuSword extends WeaponCard {
	constructor(suit, number) {
		super('wuliu-sword', suit, number);
	}
}

class Triblade extends WeaponCard {
	constructor(suit, number) {
		super('triblade', suit, number);
	}
}

module.exports = function () {
	return [
		new std.Crossbow(Suit.Diamond, 1),
		new std.YinyangSword(Suit.Spade, 2),
		new std.QinggangSword(Suit.Spade, 6),
		new std.FrostSword(Suit.Spade, 2),
		new std.Spear(Suit.Spade, 12),
		new mnv.PheonixFan(Suit.Diamond, 1),
		new std.Axe(Suit.Diamond, 5),
		new std.KylinBow(Suit.Heart, 5),
		new WuliuSword(Suit.Diamond, 6),
		new Triblade(Suit.Diamond, 12),

		new std.EightDiagram(Suit.Spade, 2),
		new std.RenwangShield(Suit.Club, 2),
		new mnv.VineArmor(Suit.Club, 2),
		new mnv.SilverLion(Suit.Club, 1),

		new DefensiveHorseCard('shadow-runner', Suit.Spade, 5),
		new DefensiveHorseCard('hex-mark', Suit.Club, 5),
		new DefensiveHorseCard('yellow-flash', Suit.Heart, 13),
		new OffensiveHorseCard('red-hare', Suit.Heart, 5),
		new OffensiveHorseCard('ferghana', Suit.Spade, 13),
		new OffensiveHorseCard('violet', Suit.Diamond, 13),
	];
};
