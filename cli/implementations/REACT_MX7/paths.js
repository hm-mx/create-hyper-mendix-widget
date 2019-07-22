const path = require('path');

const { mxProjectRootDir } = require('./src/utils/readConfig')();

module.exports = {
  widgetRoot: __dirname,
  srcDir: path.join(__dirname, 'src'),
  testCoverageDir: path.join(__dirname, 'reports'),
  srcEntry: './src/index.js',
  confDir: __dirname,
  buildDir: path.join(__dirname, 'build'),
  mxProjectRootDir,
  widgetPackageXML: path.join(__dirname, 'src', 'package.ejs'),
  widgetConfigXML: path.join(__dirname, 'src', 'widget.config.ejs'),
};
