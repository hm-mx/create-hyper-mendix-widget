const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace');

const IMPLEMENTATIONS = require('./implementations/IMPLEMENTATIONS');
const { PLUGGABLE_WIDGET } = require('./options');

const widgetCreatorModuleName = 'create-mendix-widget';

function getWidgetCreatorModulePath() {
  const npmGlobalModulesRoot = shell
    .exec('npm root -g', {
      silent: true,
    })
    .stdout.trim();

  const npmLocalModulesRoot = shell
    .exec('npm root', {
      silent: true,
    })
    .stdout.trim();

  const widgetCreatorGlobalModulePath = path.join(
    npmGlobalModulesRoot,
    widgetCreatorModuleName
  );

  const widgetCreatorLocalModulePath = path.join(
    npmLocalModulesRoot,
    widgetCreatorModuleName
  );

  // if the creator module was installed locally then favor it on the globally installed module.
  if (fs.existsSync(widgetCreatorLocalModulePath)) {
    return widgetCreatorLocalModulePath;
  }
  return widgetCreatorGlobalModulePath;
}

function getImplementationName(selected) {
  if (selected === PLUGGABLE_WIDGET) return IMPLEMENTATIONS.REACT_MX8;
  return IMPLEMENTATIONS.REACT_MX7;
}

function makeWidgetDir(dirName) {
  return !fs.existsSync(dirName) ? shell.mkdir(dirName).code === 0 : false;
}

function copyWidgetFiles(targetFolder, selectedImplementation) {
  const widgetCreatorModulePath = getWidgetCreatorModulePath();
  if (widgetCreatorModulePath) {
    fs.copySync(
      path.join(
        widgetCreatorModulePath,
        'cli',
        'implementations',
        getImplementationName(selectedImplementation)
      ),
      targetFolder
    );
    return true;
  }

  return false;
}

function tokenizeAndCapitalize(string, delimiter = '-') {
  return string
    .split(delimiter)
    .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1));
}

function initWidget({
  packageName, // my-awesome-widget
  description,
  author,
  email,
  initialVersion,
  license,
  initInsideFolder,
}) {
  const tokenized = tokenizeAndCapitalize(packageName);
  const widgetNameInCamelCase = tokenized.join('');
  const widgetFriendlyName = tokenized.join(' ');

  function replacePackageJsonContent(regex, replacement) {
    replace({
      regex,
      replacement,
      paths: initInsideFolder ? ['.'] : [packageName],
      recursive: true,
      silent: true,
    });
  }

  try {
    replacePackageJsonContent(/<<packageName>>/, packageName);
    replacePackageJsonContent(/<<widgetName>>/, widgetNameInCamelCase);
    replacePackageJsonContent(/<<widgetFriendlyName>>/, widgetFriendlyName);
    replacePackageJsonContent(/<<widgetDescription>>/, description);
    replacePackageJsonContent(/<<version>>/, initialVersion);
    replacePackageJsonContent(/<<authorName>>/, author);
    replacePackageJsonContent(/<<authorEmail>>/, email);
    replacePackageJsonContent(/<<license>>/, license);

    return true;
  } catch (error) {
    return false;
  }
}

function installDependencies(dirName) {
  shell.cd(path.join(process.cwd(), dirName));
  return (
    shell.exec('npm install', {
      silent: true,
    }).code === 0
  ); // success
}

function buildingInitialWidget() {
  return (
    shell.exec('npm run build', {
      silent: true,
    }).code === 0
  ); // success
}

function initGit() {
  shell.cd(process.cwd());
  return (
    shell.exec(
      `git init && git add --all -- ':!src/*' && git commit -m "Init widget"`,
      {
        silent: true,
      }
    ).code === 0
  ); // success
}

module.exports = {
  makeWidgetDir,
  copyWidgetFiles,
  initWidget,
  installDependencies,
  buildingInitialWidget,
  initGit,
};
