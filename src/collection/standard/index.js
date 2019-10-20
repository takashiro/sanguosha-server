
const Collection = require('../../core/Collection');

const wei = require('./list/wei');
const shu = require('./list/shu');
const wu = require('./list/wu');
const qun = require('./list/qun');

const basic = require('./list/basic');
const equip = require('./list/equip');
const trick = require('./list/trick');

class StandardCollection extends Collection {
	constructor() {
		super('standard');
	}

	createGenerals() {
		return [
			...wei,
			...shu,
			...wu,
			...qun,
		];
	}

	createCards() {
		return [
			...basic(),
			...equip(),
			...trick(),
		];
	}
}

module.exports = new StandardCollection();
