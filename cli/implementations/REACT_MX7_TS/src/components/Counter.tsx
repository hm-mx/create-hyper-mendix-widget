import React from 'react';

interface CounterProps {
  style?: { [key: string]: string };
  dummyKey: string;
  mxObject?: {
    get: Function;
    set: Function;
    getGuid: Function;
  };
}

interface CounterState {
  count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
  state = { count: 0 };

  /**
   * in case your widget requires context
   * i.e. needsEntityContext="true" in `widget.config.ejs`
   */
  componentDidMount() {
    const { mxObject } = this.props;
    if (mxObject) {
      // Do something one time when component is rendered
    }
  }

  componentDidUpdate() {
    const { mxObject } = this.props;
    if (mxObject) {
      // Do something that will fire every time when context is changed
    }
  }

  down = () => {
    this.setState(({ count }) => ({ count: count - 1 }));
  };

  up = () => {
    this.setState(({ count }) => ({ count: count + 1 }));
  };

  render() {
    const { count } = this.state;
    const { style, dummyKey } = this.props;

    return (
      <div className="react-counter" style={style}>
        <div className="counter-header">
          <h1>{dummyKey}</h1>
        </div>
        <h1 className="counter-count">{count}</h1>
        <div className="controls-wrapper">
          <button type="button" className="counter-btn" onClick={this.down}>
            -
          </button>
          <button type="button" className="counter-btn" onClick={this.up}>
            +
          </button>
        </div>
      </div>
    );
  }
}

export default Counter;
