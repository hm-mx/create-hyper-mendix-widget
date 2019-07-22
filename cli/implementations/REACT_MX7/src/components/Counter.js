import React from 'react'; // eslint-disable-line import/no-unresolved

class Counter extends React.Component {
  state = { count: 0 };

  down = () => {
    this.setState(state => ({ count: state.count - 1 }));
  };

  up = () => {
    this.setState(state => ({ count: state.count + 1 }));
  };

  render() {
    const { count } = this.state;
    const { style, dummyKey } = this.props;

    return (
      <div className="react-counter" style={style}>
        <div className="counter-header">
          <span>•••</span>
          <h1>{dummyKey}</h1>
          <span>•••</span>
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
