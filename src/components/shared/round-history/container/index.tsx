import React from "react";

import Styles from "./styles.module.scss";

const RoundHistoryContainer: React.FunctionComponent = (props) => <div className={Styles.container}>{props.children}</div>;

export default RoundHistoryContainer;
