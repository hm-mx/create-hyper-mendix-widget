import declare from 'dojoBaseDeclare';
import _widgetBase from 'MxWidgetBase';
import React from 'react';
import ReactDOM from 'react-dom';

import './style/style.scss';

import { widgetName } from '../package.json';
import Counter from './components/Counter';
import { CounterWidgetProps } from './typings';
import { getValue } from './utils/mxHelpers';
import parseStyle from './utils/parseStyle';

/**
 * This is a DOJO wrapper
 */

export default declare(`${widgetName}.widget.${widgetName}`, [_widgetBase], {
  constructor() {},
  postCreate() {
    console.debug(`${this.id} >> postCreate`);
  },
  update(mxObject: mendix.lib.MxObject, callback: () => void) {
    console.debug(`${this.id} >> update`);
    const { style: styleAsString, ...params } = this.params;
    const style = parseStyle(styleAsString);
    const props = { ...params, style, dummyKey: this.dummyKey, mxObject };
    this.resetSubscriptions(mxObject);
    this.render(props);
    callback();
  },
  resetSubscriptions(mxObject: mendix.lib.MxObject) {
    this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    this.subscriptionHandles = [];
    let self = this;
    if (mxObject) {
      const commonOptions = {
        callback: function() {
          // get the value from the context
          const dummyKey = getValue(self.params.dummyKey, '', mxObject);
          if (dummyKey !== self.dummyKey) {
            // re-render if dummyKey is updated
            self.render({ ...self.params, dummyKey: self.dummyKey, mxObject });
          }
        },
        guid: mxObject.getGuid(),
      };
      self.subscriptionHandles = [
        window.mx.data.subscribe(commonOptions), // do we need this line?
        window.mx.data.subscribe({
          attr: self.params.targetAttribute,
          ...commonOptions,
        }),
      ];
    }
  },
  render(props: CounterWidgetProps) {
    ReactDOM.render(<Counter {...props} />, this.domNode);
  },
});
