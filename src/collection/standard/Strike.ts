const BasicCard = require('../BasicCard');
const Phase = require('../../core/Player/Phase');

const DamageStruct = require('../../driver/DamageStruct');

class Strike extends BasicCard {
	constructor(suit, number) {
		super('strike', suit, number);
	}

	async isAvailable(source) {
		return source && source.getPhase() === Phase.Play;
	}

	async targetFilter(selected, target, source) {
		if (selected.length > 0 || !target) {
			return false;
		}

		const driver = target.getDriver();
		if (!driver) {
			return false;
		}

		if (!source) {
			return true;
		}

		const inRange = await driver.isInAttackRange(source, target);
		return inRange;
	}

	async targetFeasible(selected) {
		return selected.length === 1;
	}

	async effect(driver, effect) {
		const damage = new DamageStruct(effect.from, effect.to, 1);
		driver.damage(damage);
	}
}

module.exports = Strike;
