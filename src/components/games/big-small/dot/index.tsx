import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    row?: number;
    col?: number;
    highlight?: boolean;
};

const BigSmallDot: React.FunctionComponent<Props> = ({ red = false, highlight = false }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-blue"]} ${highlight ? "highlight-current-result" : ""}`} />;
};

export const BigSmallDotNumber: React.FunctionComponent<Props> = ({ red = false, col, row }) => {
    return (
        <div
            className={`${red ? Styles["dot-red"] : Styles["dot-blue"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        />
    );
};

export default BigSmallDot;
