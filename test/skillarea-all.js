
const assert = require('assert');
const Skill = require('../core/Skill');
const SkillArea = require('../core/SkillArea');

describe('SkillArea', function () {
	const area = new SkillArea(SkillArea.Type.Acquired);
	const skill1 = new Skill('test1');
	const skill2 = new Skill('test2');

	it('adds a skill', function () {
		area.add(skill1);
	});

	it('has skill 1', function () {
		assert(area.has(skill1));
		assert(!area.has(skill2));
	});

	it('adds another skill', function () {
		area.add(skill2);
		assert(area.has(skill2));
	});

	it('removes duplicate skill', function () {
		assert(!area.add(skill1));
	});

	it('removes skill 1', function () {
		assert(area.has(skill1));
		area.remove(skill1);
		assert(!area.has(skill1));
	});
});
