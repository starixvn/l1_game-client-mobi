import React from "react";
import Styles from "./item-next.module.scss";

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
