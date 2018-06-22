
module.exports = {
	defineEnum: function () {
		const enumerations = {};
		for (let i = 0; i < arguments.length; i++) {
			enumerations[arguments[i]] = i;
		}
		return Object.freeze(enumerations);
	},
};
