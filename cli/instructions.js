const chalk = require('chalk');
const package = require('../package.json');
const warning = chalk.keyword('orange');
const boxen = require('boxen');
module.exports = {
    sayHello() {
        console.log(
            `
			${chalk.bold('\n🚀 🚀  Create Hyper Mendix Widget!')}${chalk.magenta(` (v${package.version})`)}\n\n${chalk.blue(
                '>> Interactive tool for generating Hyper Mendix Widgets!\n>> More info? Please visit: https://github.com/omnajjar/create-hyper-mendix-widget'
            )}\n${chalk.yellowBright(
                '>> Any Issue? Please report them at: https://github.com/omnajjar/create-hyper-mendix-widget/issues'
            )}
			`
        );
    },
    afterInstallMessage(widgteDirName) {
        console.log(`${chalk.bold("\n😎  Nice! we're ready to go! 🛴")}`);
        console.log(
            boxen(
                chalk.cyanBright(
                    `\n${chalk.white('//Type in your cmd or terminal:')}\n\n$ cd ${widgteDirName}\n\n${chalk.white(
                        '//For development (with source maps) run:'
                    )}\n$ npm run dev\n\n${chalk.white(
                        '//For production (minified & uglified, no source maps) run:'
                    )}\n$ npm run build\n`
                ),
                { padding: 1, margin: 0, borderStyle: 'round' }
            )
        );
    },
    dirAlreadyExisted(dirName) {
        console.log(warning(`It seems that there is already a folder with the name '${dirName}'.`));
    }
};
