const zip = require('bestzip');
const path = require('path');
const fs = require('fs-extra');

const { widgetName } = require('./package.json');
const paths = require('./paths');

const zipToFolders = async () => {
  try {
    await zip({
      source: '.',
      destination: `./${widgetName}.mpk`,
      cwd: path.join(process.cwd(), 'build'),
    });

    console.log(`Generated ${widgetName}.mpk`); // eslint-disable-line no-console

    const { mxProjectRootDir } = paths;
    if (mxProjectRootDir) {
      await fs.copy(
        `./build/${widgetName}.mpk`,
        `${mxProjectRootDir}/widgets/${widgetName}.mpk`
      );

      console.log(`Copied to your Mendix project: ${mxProjectRootDir}`); // eslint-disable-line no-console
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
};

zipToFolders();
