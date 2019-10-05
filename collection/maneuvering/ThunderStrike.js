const Strike = require('../standard/Strike');

class ThunderStrike extends Strike {
	constructor(suit, number) {
		super(suit, number);
		this._name = 'thunder-strike';
	}
}

module.exports = ThunderStrike;
