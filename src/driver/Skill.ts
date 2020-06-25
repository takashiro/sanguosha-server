import { Skill as MetaSkill } from '@karuta/sanguosha-core';

import SkillEffect from './SkillEffect';

export default abstract class Skill extends MetaSkill {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract getEffects(): SkillEffect<any>[];
}
