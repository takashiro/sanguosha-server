
class General {
	constructor(name, kingdom, maxHp, gender) {
		this.id = 0;
		this.name = name;
		this.kingdom = kingdom;
		this.maxHp = maxHp;
		this.gender = gender;

		this.emperor = false;
		this.hidden = false;

		this.headExtraMaxHp = 0;
		this.deputyExtraMaxHp = 0;

		this.companions = new Set();

		this.skills = [];
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getKingdom() {
		return this.kingdom;
	}

	getMaxHp() {
		return this.maxHp;
	}

	getGender() {
		return this.gender;
	}

	setEmperor(emperor) {
		this.emperor = emperor;
	}

	isEmperor() {
		return this.emperor;
	}

	isHidden() {
		return this.hidden;
	}

	getHeadMaxHp() {
		return this.maxHp + this.headExtraMaxHp;
	}

	getDeputyMaxHp() {
		return this.maxHp + this.deputyExtraMaxHp;
	}

	addCompanion(companion) {
		this.companions.add(companion);
	}

	isCompanionWith(general) {
		return this.companions.has(general.getName());
	}

	addSkill(skillClass) {
		this.skills.push(skillClass);
	}

	getSkills() {
		return this.skills;
	}

	toJSON() {
		return {
			kingdom: this.getKingdom(),
			name: this.getName(),
		};
	}
}

module.exports = General;
