
class Collection {

	constructor(name) {
		this._name = name;
		this._cards = [];
		this._generals = [];
	}

	name() {
		return this._name;
	}

	cards() {
		return this._cards;
	}

	setCards(cards) {
		this._cards = cards;
	}

	generals() {
		return this._generals;
	}

	setGenerals(generals) {
		this._generals = generals;
	}

}

module.exports = Collection;
