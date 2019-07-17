# Create Mendix Widget

Create Mendix Widget with one command.

-   [Requirement](#requirement)
-   [Create a Mendix widget](#create-a-mendix-widget)
-   [Available Scripts](#available-scripts)

Create Mendix Widget works on macOS, Windows, and Linux.
If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

## Why

Mendix is moving from Dojo to React very soon. From version 7.13.1 and above, you can already build widgets in React without Dojo. [Pluggable widget](<(https://docs.mendix.com/howto/extensibility/pluggable-widgets)>) is awesome, but it is only available in Mendix 8. Before you upgrade your Mendix app to version 8, you might already want to gradually migrate your widgets to React.

From **version 7.13.1** or higher, you can already build widgets in React without Dojo.
Yet you might need a tool to help you configure everything for you.

NOTE: if your Mendix is lower than 7.13.1 and you really want to build widgets in React, consider using [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget).

## Requirement

Mendix version 7.13.1 or higher.

## Create A Mendix Widget

```bash

npx create-mendix-widget awesome-widget

```

During the process, you will be prompt with several questions, such as the path to your Mendix project.
After it is done, navigate to the folder of your newly-created widget. Run it in dev mode.

In dev mode, any changes you made will trigger an unoptimized build with source maps.

```bash

cd awesome-widget
npm run dev

```

And then build your Mendix app locally to see it in action!

## Build

```bash
npm run build
```

Build an optimized (minified & uglified) version of your widget without source maps.

## Issues

If something doesn’t work, please [file an issue](https://github.com/hm-mx/create-mendix-widget/issues/new).

## Acknowledgements

This project is forked from Osama Najjar's [create-hyper-mendix-widget](https://github.com/omnajjar/create-hyper-mendix-widget)

## License

`create-mendix-widget` is licensed as MIT.
