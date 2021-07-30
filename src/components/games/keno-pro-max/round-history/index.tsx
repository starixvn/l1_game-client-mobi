import React from "react";

import { Round } from "../../../../types";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../keno-pro-max-helper";
import { Result, SettlementResult } from "../keno-pro-max";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult } = round;
    const totalDiceRed = 4;
    const countRed = 1;

    return (
        <>
            <span className="tooltip-round">#{roundId}</span>
            <div className={Styles["tooltip-content"]}>
                <span className="tooltip-result">{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-odd"]}></span>
                    <span className={Styles["number"]}>{countRed}</span>
                </div>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-even"]}></span>
                    <span className={Styles["number"]}>{totalDiceRed - countRed}</span>
                </div>
            </div>
        </>
    );
};

export const RenderKenoProMaxDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    return <RoundDot choice={true ? Choices.big : Choices.small} highlight={!isShowBlink && index === numberOfItems - 1} />;
};
