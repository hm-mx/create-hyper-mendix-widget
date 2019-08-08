const chalk = require('chalk');
const boxen = require('boxen');

const { version } = require('../package.json');

const { magenta, bold, blue, yellowBright, white, cyanBright } = chalk;
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
  afterInstallMessage(widgteDirName, initInsideFolder = false) {
    console.log(
      `${bold(
        `
    ${emoji ? '😎  ' : ''}Nice! we're ready to go! ${emoji ? '🛴' : ''}`
      )}`
    );

    const cdCommand = `

    ${white('//Type in your cmd or terminal:')}                    
    ${cyanBright(`$ cd ${widgteDirName}`)}
    `;

    const devCommand = `
    ${white('//For development (with source maps) run:')}
    ${cyanBright(`$ npm run start`)}`;

    const buildCommand = `
    ${white('//For production (minified & uglified, no source maps) run:')}
    ${cyanBright(`$ npm run build`)}`;

    console.log(
      boxen(
        `${!initInsideFolder ? cdCommand : ''}
      ${devCommand}
                    
      ${buildCommand}`,
        {
          padding: { top: 1, left: 1, right: 2, bottom: 2 },
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
