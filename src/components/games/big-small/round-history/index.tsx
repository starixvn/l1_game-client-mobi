import React from "react";
import { Round } from "../../../../types";
import { Result, SettlementResult } from "../big-small";
import { Choices } from "../big-small-helper";
import { RoundDot } from "../../../shared/round-history/dot";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const ResultValue = Object.values(result);

    return (
        <>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    {settlementResult.big ? t("big") : t("small")} (
                    {ResultValue.map((value, index, arr) => {
                        if (arr.length - 1 === index) {
                            return value;
                        } else {
                            return `${value}-`;
                        }
                    })}
                    )
                </span>
                <div className={Styles["tooltip-display"]}></div>
            </div>
        </>
    );
};
export const RenderBigSmallDot = (
    round: Round<Result, SettlementResult>,
    isLockingBet: () => boolean,
    index: number,
    numberOfItems: number
) => {
    return (
        <RoundDot
            choice={round.settlementResult.small ? Choices.small : Choices.big}
            highlight={!isLockingBet() && index === numberOfItems - 1}
        />
    );
};
