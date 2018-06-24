
const Collection = require('../../core/Collection');

const HegemonyStandard = new Collection('hegemony-standard');

const wei = require('./wei');
const shu = require('./shu');
const wu = require('./wu');
const qun = require('./qun');
HegemonyStandard.generals = [
	...wei,
	...shu,
	...wu,
	...qun,
];

const create_basic_cards = require('./basic-cards');
const create_equip_cards = require('./equip-cards');
const create_trick_cards = require('./trick-cards');
HegemonyStandard.createCards = function() {
	let basic_cards = create_basic_cards();
	let equip_cards = create_equip_cards();
	let trick_cards = create_trick_cards();
	return [
		...basic_cards,
		...equip_cards,
		...trick_cards,
	];
};

module.exports = HegemonyStandard;
