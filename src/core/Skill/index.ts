
const Tag = require('./Tag');
const Type = require('./Type');

class Skill {
	constructor(name, tags = []) {
		this.name = name;
		this.tags = tags;

		this.children = [];
	}

	getName() {
		return this.name;
	}

	getTags() {
		return this.tags;
	}

	hasTag(tag) {
		return this.tags.indexOf(tag) >= 0;
	}

	getChildren() {
		return this.children;
	}
}

Skill.Tag = Tag;
Skill.Type = Type;

module.exports = Skill;
