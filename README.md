# Create Hyper Mendix Widget

<p align='center'>
<img src='https://github.com/omnajjar/create-hyper-mendix-widget/blob/master/logo.PNG?raw=true' width="300px" alt='logo'>
</p>

Create hyper mendix widget is a CLI tool generates different implementations of **'Hyper Mendix Widget'** Abstraction or Design principle.<br>

- [Demo](https://hypermendixwidgetd-sandbox.mxapps.io/index.html?profile=Responsive)
- [About Hyper Mendix Widget](https://omnajjar.github.io/create-hyper-mendix-widget/)
- [Installation](#installation)
- [Quick Overview](#quick-overview)
- [Available Implementations](#available-implementations)
- [Available Scripts](#available-scripts)
- [Issues](#issues)
- [License](#license)

Create Hyper Mendix Widget works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/omnajjar/create-hyper-mendix-widget/issues/new).


## Installation


```sh

$ npm install -g create-hyper-mendix-widget

```

## Quick Overview
After installing `create-hyper-mendix-widget` globally, in your terminal or command line run the following command :

```sh

$ create-hyper-mendix-widget

```
`create-hyper-mendix-widget` will ask you some questions about your new hyper widget like your widget's name, description, and type of [implementation](#available-implementations).

## Available Implementations

- [React (no dojo wrapper, requires mx7.13.1 or higher)](https://reactjs.org/)
- [Hyperapp v.1](https://github.com/jorgebucaran/hyperapp)
- [React (with dojo wrapper)](https://reactjs.org/)
- [Vue](https://vuejs.org/)
- [JQuery)](https://jquery.com/)
- [ES6 (Vanilla JS)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)



## Available Scripts

- `npm run dev` or `yarn dev`
will watch for any changes you made and build unoptimized version of your widget with a source map for debugging.

- `npm run build` or `yarn build`
will build an optimized (minified & uglified) version of your widget & no source maps will be genrated.



## Issues
If something doesn’t work, please [file an issue](https://github.com/omnajjar/create-hyper-mendix-widget/issues/new).

## License

`create-hyper-mendix-widget` is licensed as MIT.