import React from "react";
import Counter from "./components/Counter";
import {parseStyle} from "./utils/parseStyle";

//import styles
import "./style/style.scss";

export default props => {
  const nextProps = {...props, style: parseStyle(props.style)};
  return <Counter {...nextProps} />;
};
