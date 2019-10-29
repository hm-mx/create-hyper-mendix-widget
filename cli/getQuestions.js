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
  filter: input => input.trim(),
  /**
   * We use kebab case here because:
   * 1. it's npm package's convention
   * 2. we can easily get the friendly name
   * 3. you can separate numbers while camelcase cannot
   */

  validate: input => {
    const validWidgetNameRegex = /^[a-z]+([0-9a-z])*(-[0-9a-z]+)*$/;
    const isValid = validWidgetNameRegex.test(input.trim());
    if (!isValid) console.log('\nPlease enter a valid widget name!');

    return isValid;
  },
};
const questions = [
  {
    type: 'input',
    name: 'mxProjectRootDir',
    message: 'Path to your Mendix project:',
    default: './dist/MendixTestProject',
    filter: input => input.trim(),
  },
  /**
   * Only ask this quetion if we add Pluggable Widget templates.
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
  {
    type: 'input',
    name: 'description',
    message: 'Widget description:',
    default: 'A widget that does awesome things!',
    filter: input => input.trim(),
    validate: input => {
      const isValid = input.trim().length > 0 && input.trim().length <= 500;

      if (!isValid)
        console.log(
          '\nPlease enter a valid widget description (no more than 500 characters).'
        );

      return isValid;
    },
  },

  /**
   * Change the id and the filepath will break the widget.
   * So it has to follow `com.mendix.widget.custom.${WidgetName}`
   */
];

module.exports = (includingPackageName = false) =>
  includingPackageName ? [packageNameQuestion, ...questions] : questions;
