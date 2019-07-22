const chalk = require('chalk');
const boxen = require('boxen');

const { version } = require('../package.json');

const { magenta, bold, blue, yellowBright, white } = chalk;
const warning = chalk.keyword('orange');
const emoji = process.platform !== 'win32';

module.exports = {
  sayHello() {
    console.log(
      `
    ${bold(
      `${emoji ? '🚀 🚀 ' : ''}Create Mendix Widget ${magenta(`(v${version})`)}`
    )}
    ${blue(
      `>> Interactive tool for generating Mendix Widgets!
    >> For more info, please visit: https://github.com/hm-mx/create-mendix-widget`
    )}
    ${yellowBright(
      '>> Any Issue? Please report them at: https://github.com/hm-mx/create-mendix-widget/issues'
    )}
    `
    );
  },
  afterInstallMessage(widgteDirName) {
    console.log(
      `${bold(
        `
    ${emoji ? '😎  ' : ''}Nice! we're ready to go! ${emoji ? '🛴' : ''}`
      )}`
    );
    console.log(
      boxen(
        chalk.cyanBright(
          `
${white('//Type in your cmd or terminal:')}
                    
$ cd ${widgteDirName}
                    
${white('//For development (with source maps) run:')}
$ npm run dev
                    
${white('//For production (minified & uglified, no source maps) run:')}
$ npm run build
    `
        ),
        {
          padding: 1,
          margin: 0,
          borderStyle: 'round',
        }
      )
    );
  },
  dirAlreadyExisted(dirName) {
    console.log(
      warning(
        `It seems that there is already a folder with the name '${dirName}'.`
      )
    );
  },
};
