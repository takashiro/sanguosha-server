
class Player {
	constructor() {
		this._hp = 0;
		this._maxHp = 0;
		this._alive = true;
		this._dying = false;

		this._seat = 0;
		this._phase = 0;

		this._role = 0;
		this._kingdom = 0;
		this._headGeneral = null;
		this._deputyGeneral = null;
	}

	hp() {
		return this._hp;
	}

	setHp(hp) {
		this._hp = hp;
	}

	maxHp() {
		return this._maxHp;
	}

	setMaxHp(maxHp) {
		this._maxHp = maxHp;
	}

	lostHp() {
		return Math.max(this.maxHp() - this.hp(), 0);
	}

	isWounded() {
		return this.lostHp() > 0;
	}

	isAlive() {
		return this._alive;
	}

	setAlive(alive) {
		this._alive = !!alive;
	}

	isDead() {
		return !this._alive;
	}

	setDead(dead) {
		this._alive = !dead;
	}

	isDying() {
		return this._dying;
	}

	setDying(dying) {
		this._dying = !!dying;
	}

	seat() {
		return this._seat;
	}

	setSeat(seat) {
		this._seat = seat;
	}

	phase() {
		return this._phase;
	}

	setPhase(phase) {
		this._phase = phase;
	}

	role() {
		return this._role;
	}

	setRole(role) {
		this._role = role;
	}

	kingdom() {
		return this._kingdom;
	}

	setKingdom(kingdom) {
		this._kingdom = kingdom;
	}

	general() {
		return this._headGeneral;
	}

	setGeneral(general) {
		this._headGeneral = general;
	}

	headGeneral() {
		return this._headGeneral;
	}

	setHeadGeneral(general) {
		this._headGeneral = general;
	}

	deputyGeneral() {
		return this._deputyGeneral;
	}

	setDeputyGeneral(general) {
		this._deputyGeneral = general;
	}
}

module.exports = Player;
