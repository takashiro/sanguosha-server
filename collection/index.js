
const fs = require('fs');
const path = require('path');

const collectionDir = path.resolve(__dirname);

let collectionDirs = fs.readdirSync(collectionDir);

let collections = [];
for (let dir of collectionDirs) {
	let fullPath = path.resolve(__dirname, dir);
	let stat = fs.statSync(fullPath);
	if (!stat.isDirectory()) {
		continue;
	}

	try {
		let collection = require(fullPath);
		collections.push(collection);
	} catch (e) {
		console.log(e);
	}
}

module.exports = collections;
