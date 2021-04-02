import React from "react";

import Styles from "./mini-round-history.module.scss";

const RoundHistoryContainer: React.FunctionComponent = (props) => (
    <div className={Styles["mini-round-history-container"]}>{props.children}</div>
);

export default RoundHistoryContainer;
