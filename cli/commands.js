const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { dirAlreadyExisted } = require('./instructions');

module.exports = {
	makeWidgetDir(dirName) {
		const nextDirName = dirName.trim();
		if (!fs.existsSync(nextDirName)) {
			shell.mkdir(nextDirName);
		} else {
			dirAlreadyExisted(dirName);
			process.exit(0);
		}
	}
};
