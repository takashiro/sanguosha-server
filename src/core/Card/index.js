
const Suit = require('./Suit');
const Color = require('./Color');
const Type = require('./Type');

function convertSuitToColor(suit) {
	if (suit === Suit.Spade || suit === Suit.Club) {
		return Color.Black;
	}
	if (suit === Suit.Heart || suit === Suit.Diamond) {
		return Color.Red;
	}
	return Color.None;
}

class Card {
	constructor(name, suit, number) {
		this.id = 0;
		this.name = name;
		this.suit = suit;
		this.number = number;
		this.color = convertSuitToColor(suit);
	}

	/**
	 * Card id
	 * @return {number}
	 */
	getId() {
		return this.id;
	}

	/**
	 * Card name
	 * @return {string}
	 */
	getName() {
		return this.name;
	}

	/**
	 * Card suit
	 * @return {Card.Suit}
	 */
	getSuit() {
		return this.suit;
	}

	/**
	 * Card number
	 * @return {number}
	 */
	getNumber() {
		return this.number;
	}

	/**
	 * Card color
	 * @return {Card.Color}
	 */
	getColor() {
		return this.color;
	}

	/**
	 * Check if the selected players are feasible
	 * @param {Player[]} selected
	 * @param {Player} source
	 * @return {boolean}
	 */
	// eslint-disable-next-line no-unused-vars
	targetFeasible(selected, source) {
		return true;
	}

	/**
	 * Check if toSelect is a valid target
	 * @param {Player[]} selected
	 * @param {Player} toSelect
	 * @param {Player} source
	 * @return {boolean}
	 */
	// eslint-disable-next-line no-unused-vars
	targetFilter(selected, toSelect, source) {
		return !!toSelect;
	}

	/**
	 * Check if this card is available
	 * @param {Player} source
	 * @return {boolean}
	 */
	isAvailable(source) {
		return Boolean(source);
	}

	/**
	 * The first procedure of using a card
	 * @param {GameDriver} driver
	 * @param {CardUseStruct} use
	 */
	// eslint-disable-next-line no-unused-vars
	onUse(driver, use) {
	}

	/**
	 * The second procedure of using a card
	 * @param {GameDriver} driver
	 * @param {CardUseStruct} use
	 */
	// eslint-disable-next-line no-unused-vars
	use(driver, use) {
	}

	/**
	 * This function will be called on every target before effect()
	 * @param {GameDriver} driver
	 * @param {CardEffectStruct} effect
	 */
	// eslint-disable-next-line no-unused-vars
	onEffect(driver, effect) {
	}

	/**
	 * This function will be called on every target after use()
	 * @param {GameDriver} driver
	 * @param {CardEffectStruct} effect
	 */
	// eslint-disable-next-line no-unused-vars
	effect(driver, effect) {
	}

	/**
	 * This function will be called after effect() has been executed on every target
	 * @param {GameDriver} driver
	 */
	// eslint-disable-next-line no-unused-vars
	complete(driver) {
	}

	/**
	 * Check if this is a virtual card
	 * @return {boolean}
	 */
	isVirtual() {
		return this.id <= 0;
	}

	/**
	 * Convert this card to JSON
	 * @return {object}
	 */
	toJSON() {
		return {
			id: this.id,
			name: this.name,
			suit: this.suit,
			number: this.number,
		};
	}
}

Card.Suit = Suit;
Card.Color = Color;
Card.Type = Type;

module.exports = Card;
