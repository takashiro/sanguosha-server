
function randsub<Element>(arr: Element[], num: number): Element[] {
	if (num >= arr.length) {
		return arr;
	}

	const flag = new Array(arr.length);

	const res = [];
	let j = num;
	while (j > 0) {
		const i = Math.floor(Math.random() * arr.length);
		if (!flag[i]) {
			res.push(arr[i]);
			flag[i] = true;
			j--;
		}
	}

	return res;
}

export default randsub;
