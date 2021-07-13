import React from "react";

import { Round } from "../../../../types";
import { RoundDot } from "../../../shared/round-history/dot";
import { checkIsEven, Choices, countRedDot } from "../se-die-helper";
import { Result, SettlementResult } from "../sedie";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = countRedDot(result);

    return (
        <>
            <div className="tooltip-round">#{roundId}</div>
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

export const RenderSeDieDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    return (
        <RoundDot
            choice={checkIsEven(countRedDot(round.result)) ? Choices.even : Choices.odd}
            highlight={!isShowBlink && index === numberOfItems - 1}
        />
    );
};
