const Strike = require('../standard/Strike');

class ThunderStrike extends Strike {
	constructor(suit, number) {
		super(suit, number);
		this.name = 'thunder-strike';
	}
}

module.exports = ThunderStrike;
