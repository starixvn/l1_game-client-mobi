import React from "react";

import { SettlementResult } from "../dragon-tiger";
import Styles from "./dot.module.scss";

type Props = {
    choice?: SettlementResult;
    row?: number;
    col?: number;
    highlight?: boolean;
};

const DragonTigerDot: React.FunctionComponent<Props> = ({ choice, highlight = false }) => {
    return (
        <div
            className={`${choice.tie ? Styles["dot-tie"] : choice.tiger ? Styles["dot-tiger"] : Styles["dot-dragon"]} ${
                highlight ? "highlight-current-result" : ""
            }`}
        />
    );
};

export const DragonTigerDotNumber: React.FunctionComponent<Props> = ({ choice, col, row }) => {
    return (
        <div
            className={`${choice.tie ? Styles["dot-tie"] : choice.tiger ? Styles["dot-tiger"] : Styles["dot-dragon"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        />
    );
};

export default DragonTigerDot;
