#!/usr/bin/env node

const inquirer = require('inquirer');
const path = require('path');
const Spinner = require('ora');

const prompt = inquirer.createPromptModule();
const getQuestions = require('./cli/getQuestions');
const {
  makeWidgetDir,
  copyWidgetFiles,
  initWidget,
  installDependencies,
  buildingInitialWidget,
} = require('./cli/commands');
const {
  sayHello,
  dirAlreadyExisted,
  afterInstallMessage,
} = require('./cli/instructions');
const { REACT_CLIENT_API } = require('./cli/options');

/**
 * we follow npm convention here.
 * packageName should always be kebab caes.
 */

const [, , ...args] = process.argv;

const getPackageName = _arg => {
  const arg = _arg.trim();
  const isValid = arg === '.' || /^[0-9a-zA-Z_-]+$/.test(arg);
  if (!isValid) {
    console.warn('\nPlease enter a valid widget name');
    process.exit(0);
  }
  /**
   * Convert camel case to kebab case
   * https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
   */
  const packageName = arg
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/^-*/, '')
    .toLowerCase();

  return packageName === '.' ? path.basename(process.cwd()) : packageName;
};

const getSpinner = (text, color = 'blue') => Spinner({ text, color });

const start = async () => {
  sayHello();

  const hasPackageName = args[0];
  const initInsideFolder = args[0] && args[0].trim() === '.';
  const questions = getQuestions(!hasPackageName);
  const answers = await prompt(questions);
  const packageName = getPackageName(args[0]);

  const makeWidgetDirSpinner = getSpinner('Creating widget directory...');
  const copyWidgetFilesSpinner = getSpinner(
    'Copying files to widget directory...'
  );
  const initWidgetSpinner = getSpinner('Initializing widget...');
  const installDependenciesSpinner = getSpinner('Installing dependencies...');
  const buildingInitialWidgetSpinner = getSpinner('Building initial widget...');

  // 1. create directory for the widget
  makeWidgetDirSpinner.start();
  if (makeWidgetDir(packageName)) {
    makeWidgetDirSpinner.color = 'green';
    makeWidgetDirSpinner.succeed('Successfully created widget directory!');
  } else {
    makeWidgetDirSpinner.color = 'red';
    makeWidgetDirSpinner.fail(
      'Oops! something went wrong while creating widget directory.'
    );
    dirAlreadyExisted(packageName);
    process.exit(0);
  }

  // 2. copy template files to widget dir
  copyWidgetFilesSpinner.start();
  const template = REACT_CLIENT_API;
  const isDoneCopying = copyWidgetFiles(
    initInsideFolder ? '.' : packageName,
    template
  );
  if (isDoneCopying) {
    copyWidgetFilesSpinner.color = 'green';
    copyWidgetFilesSpinner.succeed(
      'Successfully copied files to widget directory!'
    );
  } else {
    copyWidgetFilesSpinner.color = 'red';
    copyWidgetFilesSpinner.fail(
      'Oops! something went wrong while copying files to widget directory.'
    );
    process.exit(0);
  }

  // 3. Initializing widget files & replacing tokens
  initWidgetSpinner.start();
  const initProps = hasPackageName
    ? { packageName, ...answers, initInsideFolder }
    : { ...answers, initInsideFolder };

  if (initWidget(initProps)) {
    initWidgetSpinner.color = 'green';
    initWidgetSpinner.succeed('Successfully initialized widget!');
  } else {
    initWidgetSpinner.color = 'red';
    initWidgetSpinner.fail(
      'Oops! something went wrong while initializing widget files.'
    );
    process.exit(0);
  }

  // 4. installing widget dependencies
  installDependenciesSpinner.start();
  if (installDependencies(packageName)) {
    installDependenciesSpinner.color = 'green';
    installDependenciesSpinner.succeed(
      'Successfully installed widget dependencies!'
    );
  } else {
    installDependenciesSpinner.color = 'red';
    installDependenciesSpinner.fail(
      'Oops! something went wrong while installing widget dependencies.'
    );
    process.exit(0);
  }

  // 5. Building initial widget
  buildingInitialWidgetSpinner.start();
  if (buildingInitialWidget()) {
    buildingInitialWidgetSpinner.color = 'green';
    buildingInitialWidgetSpinner.succeed('Successfully built widget!');
  } else {
    buildingInitialWidgetSpinner.color = 'red';
    buildingInitialWidgetSpinner.fail(
      'Oops! something went wrong while building widget.'
    );
    process.exit(0);
  }

  afterInstallMessage(packageName, initInsideFolder);
};

start();
