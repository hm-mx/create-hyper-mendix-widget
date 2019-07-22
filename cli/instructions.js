const chalk = require('chalk');
const boxen = require('boxen');

const { version } = require('../package.json');

const { keyword, magenta, bold, blue, yellowBright, white } = chalk;
const warning = keyword('orange');
const emoji = process.platform !== 'win32';

module.exports = {
  sayHello() {
    console.log(
      `
            ${bold(
              `${emoji ? '🚀 🚀 ' : ''}Create Mendix Widget ${magenta(
                `(v${version})`
              )}`
            )}
            ${blue(
              `>> Interactive tool for generating Hyper Mendix Widgets!
                 >> More info? Please visit: https://github.com/hm-mx/create-mendix-widget`
            )}
            ${yellowBright(
              '>> Any Issue? Please report them at: https://github.com/omnajjar/create-hyper-mendix-widget/issues'
            )}
			`
    );
  },
  afterInstallMessage(widgteDirName) {
    console.log(
      `${bold(
        `
                ${emoji ? '😎  ' : ''}Nice! we're ready to go! ${
          emoji ? '🛴' : ''
        }`
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
                    
                    ${white(
                      '//For production (minified & uglified, no source maps) run:'
                    )}
                    $ npm run build\n`
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
