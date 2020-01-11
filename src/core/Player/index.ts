
class Player {
	constructor() {
		this.hp = 0;
		this.maxHp = 0;
		this.alive = true;
		this.dying = false;

		this.seat = 0;
		this.phase = 0;

		this.role = 0;
		this.kingdom = 0;
		this.headGeneral = null;
		this.deputyGeneral = null;

		this.attackRange = 1;
	}

	getHp() {
		return this.hp;
	}

	setHp(hp) {
		this.hp = hp;
	}

	getMaxHp() {
		return this.maxHp;
	}

	setMaxHp(maxHp) {
		this.maxHp = maxHp;
	}

	getLostHp() {
		return Math.max(this.getMaxHp() - this.getHp(), 0);
	}

	isWounded() {
		return this.getLostHp() > 0;
	}

	isAlive() {
		return this.alive;
	}

	setAlive(alive) {
		this.alive = !!alive;
	}

	isDead() {
		return !this.alive;
	}

	setDead(dead) {
		this.alive = !dead;
	}

	isDying() {
		return this.dying;
	}

	setDying(dying) {
		this.dying = !!dying;
	}

	getSeat() {
		return this.seat;
	}

	setSeat(seat) {
		this.seat = seat;
	}

	getPhase() {
		return this.phase;
	}

	setPhase(phase) {
		this.phase = phase;
	}

	getRole() {
		return this.role;
	}

	setRole(role) {
		this.role = role;
	}

	getKingdom() {
		return this.kingdom;
	}

	setKingdom(kingdom) {
		this.kingdom = kingdom;
	}

	getGeneral() {
		return this.headGeneral;
	}

	setGeneral(general) {
		this.headGeneral = general;
	}

	getHeadGeneral() {
		return this.headGeneral;
	}

	setHeadGeneral(general) {
		this.headGeneral = general;
	}

	getDeputyGeneral() {
		return this.deputyGeneral;
	}

	setDeputyGeneral(general) {
		this.deputyGeneral = general;
	}

	getAttackRange() {
		return this.attackRange;
	}

	setAttackRange(range) {
		this.attackRange = range;
	}
}

module.exports = Player;
