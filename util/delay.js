
/**
 * Delay for N milliseconds
 * @param {number} msecs
 * @return {Promise}
 */
function delay(msecs) {
	return new Promise(function (resolve) {
		setTimeout(resolve, msecs);
	});
}

module.exports = delay;
