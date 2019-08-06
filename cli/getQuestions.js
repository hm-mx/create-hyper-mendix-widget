'use strict';

// const { PLUGGABLE_WIDGET, REACT_CLIENT_API } = require('./options');

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
  {
    type: 'input',
    name: 'description',
    message: 'Widget description:',
    default: 'My awesome widget!',
    validate: input => {
      const isValid = input.trim().length > 0 && input.trim().length <= 500;

      if (!isValid)
        console.log(
          '\nPlease enter a valid widget description (no more than 500 characters).'
        );

      return isValid;
    },
  },
  {
    type: 'input',
    name: 'author',
    message: 'Author',
    default: 'John Doe',
    validate: input => {
      const isValid = input.trim().length > 0;
      if (!isValid) console.log('\nPlease enter a valid author name!');

      return isValid;
    },
  },
  {
    type: 'input',
    name: 'email',
    message: 'Email:',
    default: 'john.doe@example.com',
    validate: input => {
      const validEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      const isValid = validEmailRegex.test(input.trim());
      if (!isValid) console.log('\nPlease enter a valid email address!');

      return isValid;
    },
  },
  {
    type: 'input',
    name: 'initialVersion',
    message: 'Initial Version:',
    default: '1.0.0',
    validate: input => {
      const validVersionRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;
      const isValid = validVersionRegex.test(input.trim());
      if (!isValid) console.log('\nPlease enter valid version number!');

      return isValid;
    },
  },
  {
    type: 'input',
    name: 'license',
    message: 'License:',
    default: 'MIT',
    validate: input => {
      const isValid = input.trim().length > 0;
      if (!isValid) console.log('\nPlease enter a valid license!');

      return isValid;
    },
  },
  /**
   * Only ask this quetion if we start to work in Mendix 8
   */

  // {
  //     type: 'list',
  //     name: 'template',
  //     message: "Which implementation you'd like to use:",
  //     choices: [PLUGGABLE_WIDGET, REACT_CLIENT_API],
  //     default: REACT_CLIENT_API,
  // },
];

module.exports = (includingPackageName = false) =>
  includingPackageName
    ? [packageNameQuestion, ...otherQuestions]
    : otherQuestions;
