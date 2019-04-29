
const Tag = require('./Tag');
const Type = require('./Type');

class Skill {

	constructor(name, tags = []) {
		this._name = name;
		this._tags = tags;

		this._subskills = [];
	}

	name() {
		return this._name;
	}

	tags() {
		return this._tags;
	}

	hasTag(tag) {
		return this._tags.indexOf(tag) >= 0;
	}

	subskills() {
		return this._subskills;
	}

}

Skill.Tag = Tag;
Skill.Type = Type;

module.exports = Skill;
