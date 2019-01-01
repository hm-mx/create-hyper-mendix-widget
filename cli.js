#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const questions = require('./cli/questions');

(async () => {
	const answers = await prompt(questions);
	console.log(answers);
})();
