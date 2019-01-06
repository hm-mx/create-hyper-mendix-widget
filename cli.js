#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const Spinner = require('ora');
const spinnerTypes = require('cli-spinners');
const questions = require('./cli/questions');
const { makeWidgetDir, copyWidgetFiles, initWidget, installDependencies } = require('./cli/commands');
const { greet } = require('./cli/instructions');

(async () => {
	greet();
	const answers = await prompt(questions);
	const cleanWidgetDirName = answers.widgetName.trim();

	const makeWidgetDirSpinner = Spinner({
		text: 'Creating widget directory...',
		color: 'blue'
	});

	const copyWidgetFilesSpinner = Spinner({
		text: 'Copying files to widget directory...',
		color: 'blue'
	});

	const initWidgetSpinner = Spinner({
		text: 'Initializing widget...',
		color: 'blue'
	});

	const installDependenciesSpinner = Spinner({
		text: 'Installing dependencies...',
		color: 'blue'
	});

	// 1. create directory for the widget
	makeWidgetDirSpinner.start();
	if (makeWidgetDir(cleanWidgetDirName)) {
		makeWidgetDirSpinner.color = 'green';
		makeWidgetDirSpinner.succeed('Successfully created widget direcotry!');
	} else {
		makeWidgetDirSpinner.color = 'red';
		makeWidgetDirSpinner.fail('Oops! something went wrong while creating widget directory.');
		process.exit(0);
	}

	// 2. copy template files to widget dir
	copyWidgetFilesSpinner.start();
	if (copyWidgetFiles(cleanWidgetDirName, answers.template)) {
		copyWidgetFilesSpinner.color = 'green';
		copyWidgetFilesSpinner.succeed('Successfully copied files to widget direcotry!');
	} else {
		copyWidgetFilesSpinner.color = 'red';
		copyWidgetFilesSpinner.fail('Oops! something went wrong while copying files to widget directory.');
		process.exit(0);
	}

	// 3. Initializing widget files & replacing tokens
	initWidgetSpinner.start();
	if (initWidget(answers)) {
		initWidgetSpinner.color = 'green';
		initWidgetSpinner.succeed('Successfully initialized widget!');
	} else {
		initWidgetSpinner.color = 'red';
		initWidgetSpinner.fail('Oops! something went wrong while initializing widget files.');
		process.exit(0);
	}

	// 4. installing widget dependencies
	installDependenciesSpinner.start();
	if (installDependencies(cleanWidgetDirName)) {
		installDependenciesSpinner.color = 'green';
		installDependenciesSpinner.succeed('Successfully installed widget dependencies!');
	} else {
		installDependenciesSpinner.color = 'red';
		installDependenciesSpinner.fail('Oops! something went wrong while installing widget dependencies.');
		process.exit(0);
	}
})();
