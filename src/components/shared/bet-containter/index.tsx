import React from "react";

import Styles from "./bet-container.module.scss";

const BetContainer: React.FC = (props) => {
    return <div className={Styles["bet-container"]}>{props.children}</div>;
};

export default BetContainer;
