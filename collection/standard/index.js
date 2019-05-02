
const Collection = require('../../core/Collection');

const wei = require('./list/wei');
const shu = require('./list/shu');
const wu = require('./list/wu');
const qun = require('./list/qun');

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

}

module.exports = new StandardCollection;
