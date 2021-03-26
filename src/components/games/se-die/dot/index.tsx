import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
};

const SeDieDot: React.FunctionComponent<Props> = ({ red = false }) => {
    return <div className={`${Styles.dot} ${red ? Styles.red : ""}`}></div>;
};

export default SeDieDot;
