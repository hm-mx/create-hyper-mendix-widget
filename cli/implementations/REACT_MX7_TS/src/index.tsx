import React from 'react';
import { RootProps } from 'typings/BaseProps';

import Counter from './components/Counter';
import parseStyle from './utils/parseStyle';

import './style/style.scss';

export default ({ style, class: className, ...props }: RootProps) => {
  /**
   * `style` and `class` are default properties that are not defined in widget.config.xml
   * You need to do some extra work to make them usable
   */
  const nextProps = { ...props, className, style: parseStyle(style) };
  /**
   * in case your widget requires context
   * i.e. needsEntityContext="true" in `widget.config.xml`
   * Do the following:
   * `return !props.mxObject ? <div>Loading...</div> : <Counter {...nextProps} />;`
   */
  return <Counter {...nextProps} />;
};
