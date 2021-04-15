import React from "react";

import Styles from "./dot.module.scss";

type Props = {
    red?: boolean;
    textInner?: string;
    row?: number;
    col?: number;
    value?: string;
    tie: boolean;
};

const DragonTigerDot: React.FunctionComponent<Props> = ({ red = false, tie = false, value }) => {
    return <div className={`${tie ? Styles["dot-tie"] : red ? Styles["dot-red"] : Styles["dot-blue"]}`}>{value}</div>;
};

export const DragonTigerDotNumber: React.FunctionComponent<Props> = ({ red = false, tie = false, textInner, col, row }) => {
    return (
        <div
            className={`${tie ? Styles["dot-tie"] : red ? Styles["dot-red"] : Styles["dot-blue"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        >
            {textInner}
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

export default DragonTigerDot;
