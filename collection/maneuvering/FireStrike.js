const Strike = require('../standard/Strike');

class FireStrike extends Strike {
	constructor(suit, number) {
		super(suit, number);
		this.name = 'fire-strike';
	}
}

module.exports = FireStrike;
