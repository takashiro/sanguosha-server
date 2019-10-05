
const fs = require('fs');
const path = require('path');

const collectionDir = path.resolve(__dirname);

const collectionDirs = fs.readdirSync(collectionDir);

const collections = [];
for (const dir of collectionDirs) {
	const fullPath = path.resolve(__dirname, dir);
	const stat = fs.statSync(fullPath);
	if (!stat.isDirectory()) {
		continue;
	}

	try {
		const collection = require(fullPath);
		collections.push(collection);
	} catch (e) {
		console.log(e);
	}
}

module.exports = collections;
