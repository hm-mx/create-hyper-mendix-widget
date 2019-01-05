#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const questions = require('./cli/questions');
const { makeWidgetDir, changeToWidgetDir } = require('./cli/commands');
const { greet } = require('./cli/instructions');

(async () => {
	greet();
	const answers = await prompt(questions);
	makeWidgetDir(answers.widgetName);
})();
