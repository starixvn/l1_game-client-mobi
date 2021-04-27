import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    count?: number;
    row?: number;
    col?: number;
    value?: number;
    highlight?: boolean;
};

const SeDieDot: React.FunctionComponent<Props> = ({ red = false, value, highlight = false }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-white"]} ${highlight ? "highlight-current-result" : ""}`}>{value}</div>;
};

export const SeDieDotNumber: React.FunctionComponent<Props> = ({ red = false, count, col, row }) => {
    return (
        <div
            className={`${red ? Styles["dot-red"] : Styles["dot-white"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        >
            {count}
        </div>
    );
};

export default SeDieDot;
