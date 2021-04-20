import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    textInner?: string;
    row?: number;
    col?: number;
    value?: string;
};

const BigSmallDot: React.FunctionComponent<Props> = ({ red = false, value }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-blue"]}`}>{value}</div>;
};

export const BigSmallDotNumber: React.FunctionComponent<Props> = ({ red = false, textInner, col, row }) => {
    return (
        <div
            className={`${red ? Styles["dot-red"] : Styles["dot-blue"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        >
            {textInner}
        </div>
    );
};

export default BigSmallDot;
