import React from "react";
import { Round } from "../../../../types";
import { Result, SettlementResult } from "../big-small";
import { Choices } from "../big-small-helper";
import { RoundDot } from "../../../shared/round-history/dot";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const ResultValue = Object.values(result);

    return (
        <>
            <div className="tooltip-round">#{roundId}</div>
            <div>
                <div className="tooltip-title">
                    <span className="tooltip-result">{settlementResult.big ? t("big") : t("small")}</span>(
                    <span className="tooltip-number">{ResultValue.join("-")}</span>)
                </div>
            </div>
        </>
    );
};
export const RenderBigSmallDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    return (
        <RoundDot
            choice={round.settlementResult.small ? Choices.small : Choices.big}
            highlight={!isShowBlink && index === numberOfItems - 1}
        />
    );
};
