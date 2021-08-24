import React from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import { BetPosition } from "../../game-base/type";
import Styles from "./styles.module.scss";

const AcceptBet: React.FC<{ betInfo: { amount: number; betPosition?: BetPosition } }> = ({ betInfo }) => {
    const customStyle: React.CSSProperties = {
        position: "fixed",
        left: betInfo.betPosition?.x - 20,
        top: betInfo.betPosition?.y - 30,
        right: "auto",
    };

    return (
        <div style={betInfo.betPosition ? customStyle : null} className={`${Styles["accepted-bet"]}`}>{`-${numberWithCommas(
            betInfo.amount
        )}`}</div>
    );
};

export default AcceptBet;
