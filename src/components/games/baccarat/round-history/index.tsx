import React from "react";

import { Round } from "../../../../types";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices, TotalCardValue, SetPoint } from "../baccarat-helper";
import { Result, SettlementResult } from "../baccarat";
import Styles from "./mini-round-history.module.scss";

export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, result } = round;
    return (
        <>
            <span className="tooltip-round">#{roundId}</span>
            <div className={Styles["tooltip-content"]}>
                <span className="tooltip-result">
                    {t("player")}: {SetPoint(TotalCardValue(result?.player))} - {t("banker")}: {SetPoint(TotalCardValue(result?.banker))}
                </span>
            </div>
        </>
    );
};

export const RenderBaccaratDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    return (
        <RoundDot
            choice={round.settlementResult.tie ? Choices.tie : round.settlementResult.banker ? Choices.banker : Choices.player}
            highlight={!isShowBlink && index === numberOfItems - 1}
        />
    );
};
