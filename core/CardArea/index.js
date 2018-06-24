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

	get size() {
		return this.cards.length;
	}
}

CardArea.Type = Type;
CardArea.Direction = Direction;

module.exports = CardArea;