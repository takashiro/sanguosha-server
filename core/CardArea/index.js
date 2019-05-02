
const Type = require('./Type');
const Direction = require('./Direction');

class CardArea {

	/**
	 * @param {Type} type
	 * @param {Player} owner
	 * @param {string} name
	 */
	constructor(type, owner = null, name = '') {
		this.type = type;
		this.owner = owner;
		this.name = name;

		this.cards = [];
	}

	/**
	 * Add a card into this area
	 * @param {Card} card
	 * @param {Direction} direction
	 */
	add(card, direction = Direction.Undefined) {
		if (this.has(card)) {
			return false;
		}

		if (direction == Direction.Top) {
			this.cards.unshift(card);
		} else {
			this.cards.push(card);
		}

		return true;
	}

	/**
	 * Remove a card from this area
	 * @param {Card} card
	 * @return {boolean} true iff this card exists and is removed
	 */
	remove(card) {
		let pos = this.cards.indexOf(card);
		if (pos >= 0) {
			this.cards.splice(pos, 1);
			return true;
		}

		return false;
	}

	/**
	 * Delete all cards
	 */
	clear() {
		this.cards = [];
	}

	/**
	 * Select a card from this area by random
	 * @return {Card}
	 */
	rand() {
		let index = Math.floor(Math.random() * this.cards.length);
		return this.cards[index];
	}

	/**
	 * Get the first card
	 * @return {Card}
	 */
	first() {
		return this.cards[0];
	}

	/**
	 * Get the first card and remove it from this area
	 * @return {Card}
	 */
	takeFirst() {
		return this.cards.shift();
	}

	/**
	 * Get the first N cards and remove them from this area
	 * @param {number} num
	 * @return {Card[]}
	 */
	shift(num) {
		return this.cards.splice(0, num);
	}

	/**
	 * Get the last card
	 * @return {Card}
	 */
	last() {
		return this.cards[this.cards.length - 1];
	}

	/**
	 * Get the last card and remove it from this area
	 * @return {Card}
	 */
	takeLast() {
		return this.cards.pop();
	}

	/**
	 * Get the last N cards and remove them from this area
	 * @param {number} num
	 */
	pop(num) {
		return this.cards.splice(this.cards.length - num, num);
	}

	/**
	 * Check if this area contains the card
	 * @param {Card} card
	 * @return {boolean}
	 */
	has(card) {
		return this.cards.indexOf(card) >= 0;
	}

	/**
	 * Find a card that matches condition
	 * @param {Function} condition
	 */
	find(condition) {
		return this.cards.find(condition);
	}

	/**
	 * The number of cards in this area
	 * @return {number}
	 */
	get size() {
		return this.cards.length;
	}

	/**
	 * Convert this area (without cards) into JSON
	 * @return {object}
	 */
	toJSON() {
		let json = {type: this.type};
		if (this.owner) {
			json.owner = this.owner.user.id;
		}
		if (this.name) {
			json.name = this.name;
		}
		return json;
	}
}

CardArea.Type = Type;
CardArea.Direction = Direction;

module.exports = CardArea;
