
/**
 * Delay for N milliseconds
 * @param {number} msecs
 * @return {Promise}
 */
function delay(msecs: number): Promise<void> {
	return new Promise(function (resolve) {
		setTimeout(resolve, msecs);
	});
}

export default delay;
