const fs = require('fs-extra');
const path = require('path');

const defaultConfigPath = path.join(__dirname, '..', '..', 'project.config');
const localConfigPath = `${defaultConfigPath}.local`;

const defaultConfig = require(defaultConfigPath); // eslint-disable-line import/no-dynamic-require

const localConfig = fs.existsSync(localConfigPath)
  ? require(localConfigPath) // eslint-disable-line import/no-dynamic-require
  : {};

function readConfig() {
  return { ...defaultConfig, ...localConfig };
}

module.exports = readConfig;
