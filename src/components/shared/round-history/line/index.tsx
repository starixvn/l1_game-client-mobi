import React from "react";
import Styles from "../round-history.module.scss";

type Props = {
    gameState: number;
};

const MiniRoundHistory: React.FC<Props> = (props) => {
    return (
        <div className={Styles["mini-statistic-container"]}>
            <div className={Styles["line-container"]}>{props.children}</div>
        </div>
    );
};

export default MiniRoundHistory;
