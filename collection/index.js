
const fs = require('fs');
const path = require('path');

const collectionDir = path.resolve(__dirname);

let collectionDirs = fs.readdirSync(collectionDir);

let collections = [];
for (let dir of collectionDirs) {
	if (dir === 'index.js') {
		continue;
	}

	let fullPath = path.resolve(__dirname, dir);
	try {
		let collection = require(fullPath);
		collections.push(collection);
	} catch (e) {
		console.log(e);
	}
}

module.exports = collections;
