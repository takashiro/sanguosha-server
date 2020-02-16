function shuffle<Element>(a: Element[]): void {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}

export default shuffle;
