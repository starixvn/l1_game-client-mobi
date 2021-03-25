import React from "react";
import Styles from "../round-history.module.scss";

type Props = {
    col: number;
    row: number;
};

export default function ItemNext(props: Props) {
    const { col, row } = props;
    return (
        <div
            className={Styles["item"] + " " + Styles["blink"]}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        ></div>
    );
}
