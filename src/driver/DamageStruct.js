const DamageType = require('./DamageType');

class DamageStruct {
	/**
	 * Create a damage struct.
	 * @param {ServerPlayer} from
	 * @param {ServerPlayer} to
	 * @param {number} num
	 */
	constructor(from, to, num, type = DamageType.Normal) {
		this.from = from;
		this.to = to;
		this.num = num;
		this.type = type;
		this.skill = null;
		this.card = null;
	}
}

module.exports = DamageStruct;
