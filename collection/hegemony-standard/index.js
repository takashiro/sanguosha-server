
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

module.exports = HegemonyStandard;
