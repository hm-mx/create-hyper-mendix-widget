'use strict';

const {
  // REACT_MX7,
  // REACT_MX8,
  JAVASCRIPT,
  TYPESCRIPT,
} = require('./options');

const packageNameQuestion = {
  type: 'input',
  name: 'packageName',
  message: 'Widget Name (using kebab case):',
  default: 'my-awesome-widget',

  /**
   * We use kebab case here because:
   * 1. it's npm package's convention
   * 2. we can easily get the friendly name
   */

  validate: input => {
    const validWidgetNameRegex = /^[0-9a-zA-Z_-]+$/;
    const isValid = validWidgetNameRegex.test(input.trim());
    if (!isValid) console.log('\nPlease enter a valid widget name!');

    return isValid;
  },
};
const otherQuestions = [
  /**
   * Only ask this quetion if we start to work in Mendix 8
   */

  // {
  //     type: 'list',
  //     name: 'template',
  //     message: "Which implementation you'd like to use:",
  //     choices: [REACT_MX8, REACT_MX7],
  //     default: REACT_MX8,
  // },
  {
    type: 'list',
    name: 'language',
    message: `Which language you'd like to develop in:`,
    choices: [JAVASCRIPT, TYPESCRIPT],
    default: TYPESCRIPT,
  },
];

module.exports = (includingPackageName = false) =>
  includingPackageName
    ? [packageNameQuestion, ...otherQuestions]
    : otherQuestions;
