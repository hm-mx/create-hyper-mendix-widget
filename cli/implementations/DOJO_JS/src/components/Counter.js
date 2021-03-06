import React, { useState } from 'react';

const Counter = ({ style, dummyKey }) => {
  const [count, setCount] = useState(0);
  const down = () => setCount(count - 1);
  const up = () => setCount(count + 1);

  return (
    <div className="react-counter" style={style}>
      <div className="counter-header">
        <h1>{dummyKey}</h1>
      </div>
      <h1 className="counter-count">{count}</h1>
      <div className="controls-wrapper">
        <button type="button" className="counter-btn" onClick={down}>
          -
        </button>
        <button type="button" className="counter-btn" onClick={up}>
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
