
class General {

	constructor(name, kingdom, maxHp, gender) {
		this._id = 0;
		this._name = name;
		this._kingdom = kingdom;
		this._maxHp = maxHp;
		this._gender = gender;

		this._emperor = false;
		this._hidden = false;

		this._headExtraMaxHp = 0;
		this._deputyExtraMaxHp = 0;

		this._companions = new Set;

		this._skills = [];
	}

	id() {
		return this._id;
	}

	name() {
		return this._name;
	}

	kingdom() {
		return this._kingdom;
	}

	maxHp() {
		return this._maxHp;
	}

	gender() {
		return this.gender;
	}

	setEmperor(emperor) {
		this._emperor = emperor;
	}

	isEmperor() {
		return this._emperor;
	}

	isHidden() {
		return this._hidden;
	}

	headMaxHp() {
		return this._maxHp + this._headExtraMaxHp;
	}

	deputyMaxHp() {
		return this._maxHp + this._deputyExtraMaxHp;
	}

	addCompanion(companion) {
		this._companions.add(companion);
	}

	isCompanionWith(general) {
		return this._companions.has(general.name());
	}

	addSkill(skillClass) {
		this._skills.push(skillClass);
	}

	skills() {
		return this._skills;
	}

	toJSON() {
		return {
			kingdom: this.kingdom(),
			name: this.name(),
		};
	}

}

module.exports = General;
