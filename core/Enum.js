
class Enum {

	/**
	 * Create an enumeration
	 */
	constructor() {
		this.enums = [...arguments];

		for (let i = 0; i < arguments.length; i++) {
			this[arguments[i]] = i;
		}

		Object.freeze(this);
	}

	/**
	 * Convert number into this enumeration
	 * @param {number} num
	 * @return {Enum}
	 */
	fromNum(num) {
		return this.enums[num];
	}

}

module.exports = Enum;
