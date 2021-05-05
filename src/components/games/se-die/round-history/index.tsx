import React from "react";
import { Round } from "../../../../types";
import SeDieDot from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { Result, SettlementResult } from "../sedie";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = countRedDot(result);

    return (
        <div>
            <div className={Styles["tooltip-roundID"]}>#{roundId}</div>
            <div className={Styles["tooltip-content"]}>
                <span className={Styles["tooltip-result"]}>{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-red"]}></span>
                    <span className={Styles["number"]}>{countRed}</span>
                </div>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-white"]}></span>
                    <span className={Styles["number"]}>{totalDiceRed - countRed}</span>
                </div>
            </div>
        </div>
    );
};

export const RenderSeDieDot = (
    round: Round<Result, SettlementResult>,
    isLockingBet: () => boolean,
    index: number,
    numberOfItems: number
) => {
    return <SeDieDot red={checkIsEven(countRedDot(round.result))} highlight={!isLockingBet() && index === numberOfItems - 1} />;
};
