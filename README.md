# Create Mendix Widget

Create Mendix Widget with one command.

- [Requirement](#requirement)
- [Create a Mendix widget](#create-a-mendix-widget)
- [Available Scripts](#available-scripts)

Create Mendix Widget works on macOS, Windows, and Linux.
If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

## Why

Mendix is moving from Dojo to React very soon. From version 7.13.1 and above, you can already build widgets in React without Dojo. [Pluggable widget](<(https://docs.mendix.com/howto/extensibility/pluggable-widgets)>) is awesome, but it is only available on Mendix 8. Before you upgrade your Mendix app to version 8, you might already want to gradually migrate your widgets to React.

From **version 7.13.1** or higher, you can already build widgets in React without Dojo.
Yet you might need a tool to help you configure everything for you.

NOTE: if your Mendix is lower than 7.13.1 and you really want to build widgets in React, consider using [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget).

## Requirements

NodeJS
Mendix version 7.13.1 or higher.

## Create A Mendix Widget

```bash

npx create-mendix-widget awesome-widget

```

During the process, you will be prompt with several questions, such as the path to your Mendix project. After it is done, navigate to the folder of your newly-created widget.

To generate the `mpk` file, run the build script. Then the `mpk` file can be found in the `build` folder.

```bash
cd awesome-widget
npm run build
```

## Development Mode

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

Then you are ready to develop your widget. First, **run your Mendix app locally**, and then run the following command to spin up the dev server.

```bash

npm run dev

```

To enable debugging, any changes you made in dev mode will trigger an unoptimized build with source maps, and your browser will automatically reload your app on the host and port specified in your `dev.config.local.js` (default: [http://localhost:3000](http://localhost:3000)).

## Build

Once you finished development, remember to run build script again.

```bash
npm run build
```

It will build an optimized (minified & uglified) version of your widget without source maps, and directly put it into your Mendix app.

## Issues

If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

## Acknowledgements

This project is forked from Osama Najjar's [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget)

## License

`create-mendix-widget` is licensed as MIT.
