#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
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

const performTask = async (
  startMessage,
  successMessage,
  failureMessage,
  task,
  failureCallback
) => {
  const spinner = getSpinner(startMessage);
  spinner.start();
  const isDone = await task();
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

const start = async () => {
  sayHello();

  const hasPackageName = args[0];
  const initInsideFolder = args[0] && args[0].trim() === '.';
  const questions = getQuestions(!hasPackageName);
  const { packageName: packageNameInAnswers, ...answers } = await prompt(
    questions
  );
  const packageName = hasPackageName
    ? getPackageName(args[0])
    : packageNameInAnswers;

  const widgetFolder = initInsideFolder
    ? path.join(process.cwd(), '..')
    : path.join(process.cwd(), packageName);

  // 1. create directory for the widget
  if (!initInsideFolder) {
    await performTask(
      'Creating widget directory...',
      'Successfully created widget directory!',
      'Oops! something went wrong while creating widget directory.',
      () => {
        const alreadyExisted = fs.existsSync(widgetFolder);
        return !alreadyExisted ? makeWidgetDir(widgetFolder) : false;
      },
      () => dirAlreadyExisted(packageName)
    );
  }

  // 2. copy template files to widget dir
  await performTask(
    'Copying files to widget directory...',
    'Successfully copied files to widget directory!',
    'Oops! something went wrong while copying files to widget directory.',
    () => {
      const template = REACT_CLIENT_API;
      return copyWidgetFiles(widgetFolder, template);
    }
  );

  // 3. Initializing widget files & replacing tokens
  await performTask(
    'Initializing widget...',
    'Successfully initialized widget!',
    'Oops! something went wrong while initializing widget files.',
    () => {
      const initProps = { packageName, ...answers, initInsideFolder };
      return initWidget(initProps);
    }
  );

  // 4. Init version control Git
  await performTask(
    'Init Git...',
    'Successfully initialized Git!',
    'Oops! something went wrong while initializing Git.',
    () => initGit(widgetFolder)
  );

  // 5. installing widget dependencies
  await performTask(
    'Installing dependencies...',
    'Successfully installed widget dependencies!',
    'Oops! something went wrong while installing widget dependencies.',
    () => installDependencies(widgetFolder)
  );

  // 6. Building initial widget
  await performTask(
    'Building initial widget...',
    'Successfully built widget!',
    'Oops! something went wrong while building widget.',
    () => buildingInitialWidget(widgetFolder)
  );

  afterInstallMessage(packageName, initInsideFolder);
};

start();
