const { Strike } = require('../standard/basic-card');

class FireStrike extends Strike {
	constructor(suit, number) {
		super(suit, number);
		this._name = 'fire-strike';
	}
}

module.exports = FireStrike;
