#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Spinner = require('ora');
const chalk = require('chalk');
const { yellowBright, cyanBright } = chalk;

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
const {
  REACT_MX7,
  REACT_MX8,
  JAVASCRIPT,
  TYPESCRIPT,
} = require('./cli/options');
const {
  COMMON,
  REACT_MX7_JS,
  REACT_MX7_TS,
  REACT_MX8_JS,
  REACT_MX8_TS,
} = require('./cli/implementations/IMPLEMENTATIONS');

/**
 * we follow npm convention here.
 * packageName should always be kebab caes.
 */

const [, , ...args] = process.argv;

const getPackageName = _arg => {
  const arg = _arg.trim();
  const packageName = arg === '.' ? path.basename(process.cwd()) : arg;
  const isValid = /^[a-z]+(-[0-9a-z]+)+$/.test(packageName);
  const warning = chalk.keyword('orange');

  if (!isValid) {
    const mpk = yellowBright('mpk');
    const exampleName = cyanBright('my-awesome-widget');
    const exampleMpk = cyanBright('MyAwesomeWidget.mpk');
    console.warn(
      warning(`
    Please provide your widget name in kebab case, e.g. ${exampleName}
    We will convert it into camel case when generating the ${mpk} file, e.g. ${exampleMpk}.
    This is to adhere the npm naming convention and avoid unpredictable variations.
    `)
    );
    process.exit(0);
  }

  return packageName;
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
  const hasPackageName = !!args[0];
  const initInsideFolder = args[0] && args[0].trim() === '.';
  const questions = getQuestions(!hasPackageName);
  const initialPackageName = hasPackageName && getPackageName(args[0]);

  sayHello();

  const {
    packageName: packageNameInAnswers,
    template = REACT_MX7,
    language = JAVASCRIPT,
    ...answers
  } = await prompt(questions);
  const packageName = initialPackageName || packageNameInAnswers;

  const widgetFolder = initInsideFolder
    ? process.cwd()
    : path.join(process.cwd(), packageName);

  // create directory for the widget
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

  // copy template files to widget dir
  await performTask(
    'Copying files to widget directory...',
    'Successfully copied files to widget directory!',
    'Oops! something went wrong while copying files to widget directory.',
    () => {
      const getImplementation = () => {
        if (template === REACT_MX7 && language === JAVASCRIPT)
          return REACT_MX7_JS;
        if (template === REACT_MX7 && language === TYPESCRIPT)
          return REACT_MX7_TS;
        if (template === REACT_MX8 && language === JAVASCRIPT)
          return REACT_MX8_JS;
        return REACT_MX8_TS;
      };

      return copyWidgetFiles(widgetFolder, getImplementation());
    }
  );

  // Initializing widget files & replacing tokens
  await performTask(
    'Initializing widget...',
    'Successfully initialized widget!',
    'Oops! something went wrong while initializing widget files.',
    () => {
      const initProps = { packageName, ...answers, initInsideFolder };
      return initWidget(initProps);
    }
  );

  // Init version control Git
  await performTask(
    'Init Git...',
    'Successfully initialized Git!',
    'Oops! something went wrong while initializing Git.',
    () => initGit(widgetFolder)
  );

  // installing widget dependencies
  await performTask(
    'Installing dependencies...',
    'Successfully installed widget dependencies!',
    'Oops! something went wrong while installing widget dependencies.',
    () => installDependencies(widgetFolder)
  );

  // Building initial widget
  await performTask(
    'Building initial widget...',
    'Successfully built widget!',
    'Oops! something went wrong while building widget.',
    () => buildingInitialWidget(widgetFolder)
  );

  afterInstallMessage(packageName, initInsideFolder);
};

start();
