
class CardEffectStruct {
	/**
	 *
	 * @param {CardUseStruct} use
	 * @param {ServerPlayer} to
	 */
	constructor(use, to) {
		this.use = use;
		this.to = to;
	}

	get from() {
		return this.use.from;
	}
}

module.exports = CardEffectStruct;
