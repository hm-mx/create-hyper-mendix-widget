const boxen = require('boxen');
const chalk = require('chalk');
module.exports = {
	greet() {
		console.log(
			boxen(`${chalk.blue('CHMK - Create Hyper Mendix Widget')} ${chalk.bold('v.1.0.0')}`, {
				padding: 1,
				margin: 1,
				borderStyle: 'round',
				borderColor: 'blue'
			})
		);
		//console.log(boxen('Create Hyper Mendix Widget', { padding: 1 }));
	}
};
