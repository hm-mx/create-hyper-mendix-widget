import { hot } from 'react-hot-loader/root';
import ReactHotLoader from 'react-hot-loader';
import PatchedReactDOM from '@hot-loader/react-dom';

import React from 'react';

import Counter from './components/Counter';
import parseStyle from './utils/parseStyle';

import './style/style.scss';

// https://github.com/gaearon/react-hot-loader/issues/1227
if (process.env.MODE === 'development')
  ReactHotLoader.patch(React, PatchedReactDOM);

/**
 * `style` and `class` are default properties that are not defined in widget.config.ejs
 * You need to do some extra work to make them usable
 */

export default hot(({ style, class: className, ...props }) => {
  const nextProps = { ...props, className, style: parseStyle(style) };
  return <Counter {...nextProps} />;
});
