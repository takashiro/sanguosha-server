
const Type = require('./Type');

class SkillArea {
	constructor(type) {
		this.type = type;
		this.skills = [];
	}

	has(skill) {
		return this.skills.indexOf(skill) >= 0;
	}

	add(skill) {
		if (this.has(skill)) {
			return false;
		}

		this.skills.push(skill);
		return true;
	}

	remove(skill) {
		const index = this.skills.indexOf(skill);
		if (index >= 0) {
			this.skills.splice(index, 1);
			return true;
		}

		return false;
	}
}

SkillArea.Type = Type;

module.exports = SkillArea;
