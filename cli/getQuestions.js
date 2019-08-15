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
    const validWidgetNameRegex = /^[0-9a-zA-Z_-]+$/;
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

  // {
  //   type: 'input',
  //   name: 'organization',
  //   message: 'Organization:',
  //   default: 'Mendix',
  //   filter: input => input.trim(),
  //   validate: input => {
  //     const hasProperLength =
  //       input.trim().length > 2 && input.trim().length < 20;
  //     const isStartedWithAlphabet = /^[a-zA-Z]/.test(input);
  //     if (!hasProperLength)
  //       console.log(
  //         '\nYour organization name is either too short or too long!'
  //       );

  //     if (!isStartedWithAlphabet)
  //       console.log(
  //         '\nYour organization name needs to start with an English Alphabet.'
  //       );

  //     return hasProperLength && isStartedWithAlphabet;
  //   },
  // },
  // {
  //   type: 'input',
  //   name: 'scope',
  //   message: 'Scope:',
  //   default: 'community',
  //   filter: input => input.trim().toLowerCase(),
  //   validate: input => {
  //     const hasProperLength =
  //       input.trim().length > 2 && input.trim().length < 20;
  //     const isAlphabet = /[a-zA-Z]/g.test(input);

  //     if (!hasProperLength)
  //       console.log('\nYour scope name is either too short or too long!');

  //     if (!isAlphabet)
  //       console.log('\nYour scope name can only contain English Alphabets.');

  //     return hasProperLength && isAlphabet;
  //   },
  // },
];

module.exports = (includingPackageName = false) =>
  includingPackageName ? [packageNameQuestion, ...questions] : questions;
