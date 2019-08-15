# Create Mendix Widget

Create Mendix Widget with one command.

- [Requirements](#requirements)
- [Usage](#usage)
- [Development](#development)
- [Build](#build)

Create Mendix Widget works on macOS, Windows, and Linux.
If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

🎉 We also support Typescript now!

## Why

Mendix is moving from Dojo to React very soon. From version 7.13.1 and above, you can already build widgets in React without Dojo. [Pluggable widget](https://docs.mendix.com/howto/extensibility/pluggable-widgets) is awesome, but it is only available on Mendix 8. Before you upgrade your Mendix app to version 8, you might already want to gradually migrate your widgets to React.

From **version 7.13.1** or higher, you can already build widgets in React without Dojo.
Yet you might need a tool to help configure everything for you.

NOTE: if your Mendix is lower than 7.13.1 and you really want to build widgets in React, consider using [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget).

## Requirements

- NodeJS
- Mendix version 7.13.1 or above (also works on Mendix 8)
- Git

NOTE: the current version of React in Mendix is 16.6.3, meaning that you cannot use [React hooks](https://reactjs.org/docs/hooks-intro.html) in your Mendix widgets just yet.

## Installation

First, Install `create-mendix-widget` globally.

```bash
npm i -g create-mendix-widget
```

## Usage

Run the following command followed by the name of your new widget.

```bash
create-mendix-widget awesome-widget
```

If you have an existing folder

```bash
cd awesome-widget
create-mendix-widget .
```

You will be prompted with several questions to initialize your new widget. It will generate the boilerplate and install dependencies.

Next, follow the instruction to navigate to the folder of your newly-created widget and you are ready to build your new widget!

## Development

In the root folder of your widget, you can find `dev.config.js`. **DO NOT** change the content of this file. This file serves as a fallback, and it should be part of the code base.

To allow local development, create `dev.config.local.js` next to `dev.config.js` and change the content according to your local settings.

```js
// dev.config.local.js
// normally you only need to overwrite the path
module.exports = {
  mxProjectRootDir: '/Users/johndoe/Documents/Mendix/MyAwesomeMendixApp',
};
```

You don't need to commit `dev.config.local.js` (it is git-ignored by default). This setup is to prevent exposing personal local configurations to the code base.

After creating `dev.config.local.js`, you need to build your widget as follows:

```bash
npm run build
```

It will generate the `mpk` file and put it into your Mendix app. If it builds successfully, you should be able to find your new widget in your Mendix Studio Pro. Drag it into your app as you normally do. Then **run your Mendix app locally**.

Finally, run the following command to spin up the dev server. It will automatically open your browser and go to [http://localhost:3000](http://localhost:3000) (or if you configure it differently in your `dev.config.local.js`).

```bash

npm run start

```

This command will watch any changes you make, and trigger an unoptimized build with source maps. Your browser will automatically reload your app (However, HMR is not yet supported). Then you can see your widget in action.

## Build

Once you finished development, remember to run build script again.

```bash
npm run build
```

It will build an optimized (minified & uglified) version of your widget without source maps, and directly put it into your Mendix app.

## Writing Your React Widget

We try to align the environment settings of the widget as close as possible with the industry standard. You can develop the widget just like a normal React component. However, the current version of React in Mendix is 16.6.3, meaning that you cannot use [React hooks](https://reactjs.org/docs/hooks-intro.html) just yet.

For testing, we use [jest](https://jestjs.io/) and [react-testing-library](https://github.com/testing-library/react-testing-library) by default. You need to configure it yourself if you want to use other testing libraries.

## Issues

If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

## Acknowledgements

This project is forked from Osama Najjar's [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget)

## License

`create-mendix-widget` is licensed as MIT.
