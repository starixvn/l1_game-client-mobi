import React from "react";
import { SettlementResult } from "../dragon-tiger";
import Styles from "./dot.module.scss";

type Props = {
    choice?: SettlementResult;
    textInner?: string;
    row?: number;
    col?: number;
    value?: string;
};

const DragonTigerDot: React.FunctionComponent<Props> = ({ choice, value }) => {
    return <div className={`${choice.tie ? Styles["dot-tie"] : choice.tiger ? Styles["dot-tiger"] : Styles["dot-dragon"]}`}>{value}</div>;
};

export const DragonTigerDotNumber: React.FunctionComponent<Props> = ({ choice, textInner, col, row }) => {
    return (
        <div
            className={`${choice.tie ? Styles["dot-tie"] : choice.tiger ? Styles["dot-tiger"] : Styles["dot-dragon"]}`}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        >
            {textInner}
        </div>
    );
};

export default DragonTigerDot;
