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

- NodeJS
- Mendix version 7.13.1 or higher.

## Create A Mendix Widget

```bash

npx create-mendix-widget awesome-widget

```

You will be prompt with several questions to initialize your new widget. It will generate the boilerplate and install dependencies. Next, navigate to the folder of your newly-created widget and you are ready to build your new widget!

```bash
cd awesome-widget
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

Before you can try your new widget in Mendix Studio Pro, you need to build your widget with the following command:

```bash
npm run build
```

It will generate the `mpk` file and put it into your Mendix app (remember to configure this in `dev.config.local.js` first).

After build is done, you should be able to find your new widget in your Mendix Studio Pro. Drag it into your app as you normally do. Then **run your Mendix app locally**.

Finally, run the following command to spin up the dev server. It will automatically open your browser and go to [http://localhost:3000](http://localhost:3000) (or if you configure it differently in your `dev.config.local.js`).

```bash

npm run dev

```

This command will watch any changes you make, and trigger an unoptimized build with source maps. Your browser will automatically reload your app (However, HMR is not yet supported). Then you can see your widget in action.

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
