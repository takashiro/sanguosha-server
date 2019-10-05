
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

const createBasicCards = require('./basic-cards');
const createEquipCards = require('./equip-cards');
const createTrickCards = require('./trick-cards');

HegemonyStandard.createCards = function () {
	const basicCards = createBasicCards();
	const equipCards = createEquipCards();
	const trickCards = createTrickCards();
	return [
		...basicCards,
		...equipCards,
		...trickCards,
	];
};

module.exports = HegemonyStandard;
