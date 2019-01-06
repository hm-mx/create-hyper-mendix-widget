const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace');
const TEMPLATES = require('./TEMPLATES');
const widgetCraetorModuleName = 'create-hyper-mendix-widget';

function _getWidgetCreatorModulePath() {
	const npmGlobalModulesRoot = shell.exec('npm root -g', { silent: true }).stdout.trim();
	const npmLocalModulesRoot = shell.exec('npm root', { silent: true }).stdout.trim();
	const widgetCreatorGlobalModulePath = path.join(npmGlobalModulesRoot, widgetCraetorModuleName);
	const widgetCreatorLocalModulePath = path.join(npmLocalModulesRoot, widgetCraetorModuleName);
	// if the creator module was installed locally then favor it on the globally installed module.
	if (fs.existsSync(widgetCreatorLocalModulePath)) {
		return widgetCreatorLocalModulePath;
	}
	return widgetCreatorGlobalModulePath;
}

function _getTemplateName(userSelectedTemplate) {
	if (userSelectedTemplate === 'Hyper!') return TEMPLATES.HYPER;
	if (userSelectedTemplate === 'ES6 only!') return TEMPLATES.ES6;
}

function makeWidgetDir(dirName) {
	if (!fs.existsSync(dirName)) {
		return shell.mkdir(dirName).code === 0; // sucess
	} else {
		return false;
	}
}

function copyWidgetFiles(dirName, selectedTemplate) {
	const widgetCreatorModulePath = _getWidgetCreatorModulePath();
	if (widgetCreatorModulePath) {
		fs.copySync(
			path.join(widgetCreatorModulePath, 'cli', 'templates', _getTemplateName(selectedTemplate)),
			path.normalize(dirName)
		);
		return true;
	} else {
		return false;
	}
}

function initWidget({ widgetName, description, author, email, initialVersion, license }) {
	try {
		replace({
			regex: '<<widgetName>>',
			replacement: widgetName,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<widgetNamePcakge>>',
			replacement: widgetName.toLowerCase(),
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<widgetDescription>>',
			replacement: description,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<version>>',
			replacement: initialVersion,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<authorName>>',
			replacement: author,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<authorEmail>>',
			replacement: email,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		replace({
			regex: '<<license>>',
			replacement: license,
			paths: [ widgetName ],
			recursive: true,
			silent: true
		});
		return true;
	} catch (error) {
		return false;
	}
}

function installDependencies(dirName) {
	shell.cd(dirName);
	return shell.exec('npm install', { silent: true }).code === 0; // success
}

function buildingInitialWidget() {
	return shell.exec('npm run build', { silent: true }).code === 0; // success
}
module.exports = {
	makeWidgetDir,
	copyWidgetFiles,
	initWidget,
	installDependencies,
	buildingInitialWidget
};
