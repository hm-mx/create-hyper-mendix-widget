const chalk = require('chalk');
const package = require('../package.json');
const warning = chalk.keyword('orange');
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
		console.log(warning(`It seems that there is already a folder with the name '${dirName}'.`));
	}
};
