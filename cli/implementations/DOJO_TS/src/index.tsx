import declare from 'dojoBaseDeclare';
import _widgetBase from 'MxWidgetBase';
import React from 'react';
import ReactDOM from 'react-dom';

import { organization as companyName, widgetName } from '../package.json';

import { ComponentProps, RootProps } from 'typings/BaseProps';

import Counter from './components/Counter';

import './style/style.scss';

const organization = companyName
  .replace(/[&/\\#,+()$~%.'":*?<>{}_\s]/g, '')
  .toLowerCase();

export default declare(
  `com.${organization}.widget.${widgetName}.${widgetName}`,
  [_widgetBase],
  {
    constructor() {
      this.subscription = null;
    },
    postCreate() {
      console.debug(`${this.id} >> postCreate`);
    },
    update(contextObject: mendix.lib.MxObject, callback: () => void) {
      console.debug(`${this.id} >> update🎉`);
      console.debug('params', this.params);

      if (contextObject && !this.subscription) {
        this.render(this.params, contextObject, this.domNode);
        this.subscription = window.mx.data.subscribe({
          guid: contextObject.getGuid(),
          callback: async (guid: number) => {
            this.render(this.params, contextObject, this.domNode);
          },
        });
      }

      callback();
    },
    render(
      params: RootProps,
      mxObject: mendix.lib.MxObject,
      parent: HTMLElement
    ) {
      const {
        mxform,
        // attribute
        dummyKey,
      } = params;
      const props: ComponentProps = {
        mxform,
        mxObject,
        tabIndex: parent.tabIndex,
        // attribute
        dummyKey,
      };
      ReactDOM.render(<Counter {...props} />, parent);
    },
  }
);
