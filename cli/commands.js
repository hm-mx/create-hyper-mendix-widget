const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = {
	mkdir(dirName) {
		const nextDirName = dirName.trim();
		if (!fs.existsSync(nextDirName)) {
			shell.mkdir(nextDirName);
		} else {
			console.log(chalk.yellow(`There is already a dir called ${nextDirName}`));
			process.exit(0);
		}
	}
};
