#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const questions = require('./cli/questions');
const cmd = require('./cli/commands');
const insructions = require('./cli/instructions');

(async () => {
	insructions.greet();
	const answers = await prompt(questions);
	cmd.mkdir(answers.widgetName);
})();
