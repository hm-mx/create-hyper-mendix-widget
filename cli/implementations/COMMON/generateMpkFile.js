const archiver = require('archiver');
const path = require('path');
const fs = require('fs-extra');

const { widgetName } = require('./package.json');
const paths = require('./paths');

// https://stackoverflow.com/a/51518100/1900505
function zipDirectory(source, target) {
  const targetWithoutExtension = target.replace(/\.(zip|mpk)$/g, '');
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(targetWithoutExtension);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
    fs.renameSync(targetWithoutExtension, `${targetWithoutExtension}.mpk`);
  });
}

const zipToFolders = async () => {
  try {
    const source = path.join(process.cwd(), 'build');
    const targetFolder = path.join(process.cwd(), 'dist');
    await fs.remove(targetFolder);
    await fs.mkdir(targetFolder);
    const target = path.join(targetFolder, widgetName);
    await zipDirectory(source, target);

    console.log(`Generated ${widgetName}.mpk`); // eslint-disable-line no-console

    const { mxProjectRootDir } = paths;
    if (mxProjectRootDir) {
      await fs.copy(
        `./dist/${widgetName}.mpk`,
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
