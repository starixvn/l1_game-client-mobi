import React from "react";

import Styles from "./styles.module.scss";

const FadeOutUp: React.FC = ({ children }) => {
    return <div className={`${Styles["fade-out-up"]} ${Styles["accepted-bet"]}`}>{children}</div>;
};

export default FadeOutUp;
