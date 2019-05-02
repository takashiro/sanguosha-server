
function randsub(arr, num) {
	if (num >= arr.length) {
		return arr;
	}

	const flag = new Array(arr.length);

	const res = [];
	while (num) {
		let i = Math.floor(Math.random() * arr.length);
		if (!flag[i]) {
			res.push(arr[i]);
			flag[i] = true;
			num--;
		}
	}

	return res;
}

module.exports = randsub;
