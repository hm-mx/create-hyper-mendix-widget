import React from 'react';

import Counter from './components/Counter';
import parseStyle from './utils/parseStyle';

import './style/style.scss';

/**
 * `style` and `class` are default properties that are not defined in widget.config.ejs
 * You need to do some extra work to make them usable
 */

interface defaultProps {
  style: string;
  class: string;
  dummyKey: string;
  [key: string]: any;
}

export default ({ style, class: className, ...props }: defaultProps) => {
  const nextProps = { ...props, className, style: parseStyle(style) };
  return <Counter {...nextProps} />;
};
