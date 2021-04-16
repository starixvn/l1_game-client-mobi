import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    count?: number;
    row?: number;
    col?: number;
    value?: string;
};

const SeDieDot: React.FunctionComponent<Props> = ({ red = false, value }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-white"]}`}>{value}</div>;
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

export const MiniItemNext = () => {
    return (
        <div>
            <div className={`${Styles["dot-next"]} ${Styles.blink}`}></div>
        </div>
    );
};

export const ScoreboardItemNext = ({ col, row }) => {
    return (
        <div
            className={`${Styles["dot-next"]} ${Styles["blink"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        ></div>
    );
};

export default SeDieDot;
