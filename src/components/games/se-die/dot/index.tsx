import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    count?: number;
    row?: number;
    col?: number;
};

const SeDieDot: React.FunctionComponent<Props> = ({ red = false }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-white"]}`}></div>;
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
    return <div className={`${Styles["dot-next"]} ${Styles.blink}`}></div>;
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
