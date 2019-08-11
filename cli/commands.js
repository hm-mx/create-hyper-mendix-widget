'use strict';

const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace');

const { COMMON } = require('./implementations/IMPLEMENTATIONS');

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

function makeWidgetDir(widgetFolder) {
  const execution = shell.mkdir(widgetFolder);
  return execution.code === 0;
}

async function copyWidgetFiles(targetFolder, implementation) {
  const widgetCreatorModulePath = getWidgetCreatorModulePath();
  if (widgetCreatorModulePath) {
    await Promise.all([
      fs.copy(
        path.join(widgetCreatorModulePath, 'cli', 'implementations', COMMON),
        targetFolder
      ),
      fs.copy(
        path.join(
          widgetCreatorModulePath,
          'cli',
          'implementations',
          implementation
        ),
        targetFolder
      ),
    ]);

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

function installDependencies(widgetFolder) {
  shell.cd(widgetFolder);
  const execution = shell.exec('npm install', { silent: true });
  return execution.code === 0; // success
}

function buildingInitialWidget(widgetFolder) {
  shell.cd(widgetFolder);
  const execution = shell.exec('npm run build', {
    silent: true,
  });
  return execution.code === 0; // success
}

async function createGitignore(widgetFolder) {
  const gitignorePath = `${widgetFolder}/.gitignore`;
  const gitignoreContent = `
node_modules/
build/
dist/
reports/
coverage/
yarn-error.log

dev.config.local.js
    `;
  if (!fs.existsSync(gitignorePath)) {
    console.log('creating .gitignore...');
    await fs.writeFileSync(gitignorePath, gitignoreContent);
  }
}

async function initGit(widgetFolder) {
  shell.cd(widgetFolder);
  shell.exec('git init');
  await createGitignore(widgetFolder);
  shell.cd(widgetFolder);
  const execution = shell.exec(
    'git add --all && git reset -- src/* && git commit -m "Init widget"',
    { silent: true }
  );

  return execution.code === 0; // success
}

module.exports = {
  makeWidgetDir,
  copyWidgetFiles,
  initWidget,
  installDependencies,
  buildingInitialWidget,
  initGit,
};
