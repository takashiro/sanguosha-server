const { Strike } = require('../standard/basic-card');

class ThunderStrike extends Strike {
	constructor(suit, number) {
		super(suit, number);
		this._name = 'thunder-strike';
	}
}

module.exports = ThunderStrike;
