const chalk = require('chalk');
const package = require('../package.json');
module.exports = {
	sayHello() {
		console.log(
			`
			${chalk.bold('\n🚀 🚀  Create Hyper Mendix Widget!')}${chalk.magenta(` (v${package.version})`)}\n\n${chalk.blue(
				'>> Interactive tool for generating Hyper Mendix Widgets!\n>> More info? Please visit: https://github.com/omnajjar/create-hyper-mendix-widget'
			)}\n${chalk.yellow(
				'>> Any Issue? Please report them at: https://github.com/omnajjar/create-hyper-mendix-widget/issues'
			)}
			`
		);
	},
	dirAlreadyExisted(dirName) {
		console.log(chalk.yellow(`There is already a dir called ${dirName}`));
	}
};
