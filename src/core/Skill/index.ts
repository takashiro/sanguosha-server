
import Tag from './Tag';
import Type from './Type';

class Skill {
	static Tag = Tag;

	static Type = Type;

	name: string;

	tags: Set<string>;

	children: Skill[];

	constructor(name: string, tags: string[] = []) {
		this.name = name;
		this.tags = new Set(tags);

		this.children = [];
	}

	getName(): string {
		return this.name;
	}

	getTags(): Set<string> {
		return this.tags;
	}

	hasTag(tag: string): boolean {
		return this.tags.has(tag);
	}

	getChildren(): Skill[] {
		return this.children;
	}
}

export default Skill;
