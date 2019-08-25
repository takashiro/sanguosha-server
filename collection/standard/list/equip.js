
const Suit = require('../../../core/Card/Suit');
const std = require('../equip-card');
const OffensiveHorseCard = require('../../OffensiveHorseCard');
const DefensiveHorseCard = require('../../DefensiveHorseCard');

function createEquipCards() {
	return [
		new std.Crossbow(Suit.Club, 1),
		new std.Crossbow(Suit.Diamond, 1),
		new std.YinyangSword(Suit.Spade, 2),
		new std.QinggangSword(Suit.Spade, 2),
		new std.GreenDragonCrescentBlade(Suit.Spade, 5),
		new std.SerpentSpear(Suit.Spade, 12),
		new std.Axe(Suit.Diamond, 5),
		new std.Halberd(Suit.Diamond, 4),
		new std.KylinBow(Suit.Heart, 5),

		new std.EightDiagram(Suit.Spade, 2),
		new std.EightDiagram(Suit.Club, 2),

		new DefensiveHorseCard('shadow-runner', Suit.Spade, 5),
		new DefensiveHorseCard('hex-mark', Suit.Club, 5),
		new DefensiveHorseCard('yellow-flash', Suit.Heart, 13),
		new OffensiveHorseCard('red-hare', Suit.Heart, 5),
		new OffensiveHorseCard('ferghana', Suit.Spade, 13),
		new OffensiveHorseCard('violet', Suit.Diamond, 13),
	];
}

module.exports = createEquipCards;
