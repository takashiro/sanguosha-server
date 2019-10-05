
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
		this._id = 0;
		this._name = name;
		this._suit = suit;
		this._number = number;
		this._color = convertSuitToColor(suit);
	}

	/**
	 * Card id
	 * @return {number}
	 */
	id() {
		return this._id;
	}

	/**
	 * Card name
	 * @return {string}
	 */
	name() {
		return this._name;
	}

	/**
	 * Card suit
	 * @return {Card.Suit}
	 */
	suit() {
		return this._suit;
	}

	/**
	 * Card number
	 * @return {number}
	 */
	number() {
		return this._number;
	}

	/**
	 * Card color
	 * @return {Card.Color}
	 */
	color() {
		return this._color;
	}


	/**
	 * Check if the selected players are feasible
	 * @param {Player[]} selected
	 * @param {Player} source
	 * @return {boolean}
	 */
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
	targetFilter(selected, toSelect, source) {
		return !!toSelect;
	}

	/**
	 * Check if this card is available
	 * @param {Player} source
	 * @return {boolean}
	 */
	isAvailable(source) {
		return true;
	}

	/**
	 * The first procedure of using a card
	 * @param {GameDriver} driver
	 * @param {CardUseStruct} use
	 */
	onUse(driver, use) {
	}

	/**
	 * The second procedure of using a card
	 * @param {GameDriver} driver
	 * @param {CardUseStruct} use
	 */
	use(driver, use) {
	}

	/**
	 * This function will be called on every target before effect()
	 * @param {GameDriver} driver
	 * @param {CardEffectStruct} effect
	 */
	onEffect(driver, effect) {
	}

	/**
	 * This function will be called on every target after use()
	 * @param {GameDriver} driver
	 * @param {CardEffectStruct} effect
	 */
	effect(driver, effect) {
	}

	/**
	 * This function will be called after effect() has been executed on every target
	 * @param {GameDriver} driver
	 */
	complete(driver) {
	}

	/**
	 * Check if this is a virtual card
	 * @return {boolean}
	 */
	isVirtual() {
		return this._id <= 0;
	}

	/**
	 * Convert this card to JSON
	 * @return {object}
	 */
	toJSON() {
		return {
			id: this._id,
			name: this._name,
			suit: this._suit,
			number: this._number,
		};
	}
}

Card.Suit = Suit;
Card.Color = Color;
Card.Type = Type;

module.exports = Card;
