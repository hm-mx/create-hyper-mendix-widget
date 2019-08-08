/**
 * We recommend isolating the usage of Mendix Client API from your React component.
 * It will make testing a lot easier.
 * For example, in your React component, you only need to mock a simple function `callMicroflow` instead of `window.mx.data.action`.
 * This is also helpful for migrating to pluggable widget later.
 *
 * We provide some examples here. You can implement your own Mendix Client API helpers.
 */

declare global {
  interface Window {
    mx: {
      data: any;
    };
  }
}

function action(params: object) {
  return new Promise((resolve, reject) => {
    window.mx.data.action({
      params,
      callback: resolve,
      error: reject,
    });
  });
}

function get(params: object) {
  return new Promise((resolve, reject) => {
    window.mx.data.get({ ...params, callback: resolve, error: reject });
  });
}

export const mxData = {
  action,
  get,
};

export const getData = get;
export const callMicroflow = (actionname: string) => action({ actionname });
