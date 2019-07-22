import React from 'react'; // eslint-disable-line import/no-unresolved

import Counter from './components/Counter';
import parseStyle from './utils/parseStyle';

import './style/style.scss';

export default ({ style, ...props }) => {
  const nextProps = { ...props, style: parseStyle(style) };
  return <Counter {...nextProps} />;
};
