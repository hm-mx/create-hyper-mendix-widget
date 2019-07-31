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
  initGit,
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

  const performTask = (
    startMessage,
    successMessage,
    failureMessage,
    task,
    failureCallback
  ) => {
    const spinner = getSpinner(startMessage);
    spinner.start();
    const isDone = task();
    if (isDone) {
      spinner.color = 'green';
      spinner.succeed(successMessage);
    } else {
      spinner.color = 'red';
      spinner.fail(failureMessage);
      if (failureCallback) failureCallback();
      process.exit(0);
    }
  };

  // 1. create directory for the widget
  performTask(
    'Creating widget directory...',
    'Successfully created widget directory!',
    'Oops! something went wrong while creating widget directory.',
    () => makeWidgetDir(packageName),
    () => dirAlreadyExisted(packageName)
  );

  // 2. copy template files to widget dir
  performTask(
    'Copying files to widget directory...',
    'Successfully copied files to widget directory!',
    'Oops! something went wrong while copying files to widget directory.',
    () => {
      const template = REACT_CLIENT_API;
      return copyWidgetFiles(initInsideFolder ? '.' : packageName, template);
    }
  );

  // 3. Initializing widget files & replacing tokens
  performTask(
    'Initializing widget...',
    'Successfully initialized widget!',
    'Oops! something went wrong while initializing widget files.',
    () => {
      const initProps = hasPackageName
        ? { packageName, ...answers, initInsideFolder }
        : { ...answers, initInsideFolder };

      return initWidget(initProps);
    }
  );

  // 4. installing widget dependencies
  performTask(
    'Installing dependencies...',
    'Successfully installed widget dependencies!',
    'Oops! something went wrong while installing widget dependencies.',
    () => installDependencies(packageName)
  );

  // 5. Building initial widget
  performTask(
    'Building initial widget...',
    'Successfully built widget!',
    'Oops! something went wrong while building widget.',
    buildingInitialWidget
  );

  // 6. Init version contral Git
  performTask(
    'Init Git...',
    'Successfully initialized Git!',
    'Oops! something went wrong while initializing Git.',
    initGit
  );

  afterInstallMessage(packageName, initInsideFolder);
};

start();
