#!/usr/bin/env node

const inquirer = require('inquirer');
const Spinner = require('ora');

const prompt = inquirer.createPromptModule();
const questions = require('./cli/questions');
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

(async () => {
  sayHello();
  const answers = await prompt(questions);
  const cleanWidgetDirName = answers.packageName.trim();

  const makeWidgetDirSpinner = Spinner({
    text: 'Creating widget directory...',
    color: 'blue',
  });

  const copyWidgetFilesSpinner = Spinner({
    text: 'Copying files to widget directory...',
    color: 'blue',
  });

  const initWidgetSpinner = Spinner({
    text: 'Initializing widget...',
    color: 'blue',
  });

  const installDependenciesSpinner = Spinner({
    text: 'Installing dependencies...',
    color: 'blue',
  });

  const buildingInitialWidgetSpinner = Spinner({
    text: 'Building initial widget...',
    color: 'blue',
  });
  // 1. create directory for the widget
  makeWidgetDirSpinner.start();
  if (makeWidgetDir(cleanWidgetDirName)) {
    makeWidgetDirSpinner.color = 'green';
    makeWidgetDirSpinner.succeed('Successfully created widget directory!');
  } else {
    makeWidgetDirSpinner.color = 'red';
    makeWidgetDirSpinner.fail(
      'Oops! something went wrong while creating widget directory.'
    );
    dirAlreadyExisted(cleanWidgetDirName);
    process.exit(0);
  }

  // 2. copy template files to widget dir
  copyWidgetFilesSpinner.start();
  const template = REACT_CLIENT_API;
  if (copyWidgetFiles(cleanWidgetDirName, template)) {
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
  if (initWidget(answers)) {
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
  if (installDependencies(cleanWidgetDirName)) {
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

  afterInstallMessage(cleanWidgetDirName);
})();
