import React from "react";

import { Round } from "../../../../types";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { Result, SettlementResult } from "../three-cards";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = 1;
    return (
        <>
            <span className="tooltip-round">#{roundId}</span>
            <div className={Styles["tooltip-content"]}>
                <span className="tooltip-result">{settlementResult.black ? t("black") : t("red")}</span>
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

export const RenderThreeCardsDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    const isBlack = true;
    return <RoundDot choice={isBlack ? Choices.black : Choices.red} highlight={!isShowBlink && index === numberOfItems - 1} />;
};
