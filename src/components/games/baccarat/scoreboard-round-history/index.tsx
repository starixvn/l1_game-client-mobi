import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { Result, SettlementResult } from "../baccarat";

export const GetElementRoundBankerPlayer = (
    result: Result,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    gameSetting: GameBaseProps,
    settlementResult: SettlementResult
) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult.tie ? "tie-baccarat" : settlementResult.player ? Choices.player : Choices.banker}
            value={
                settlementResult.tie
                    ? translateDotTextMapping[Choices.tie]
                    : settlementResult.banker
                    ? translateDotTextMapping[Choices.banker]
                    : translateDotTextMapping[Choices.player]
            }
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const GetElementRoundBigSmall = (
    result: Result,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    gameSetting: GameBaseProps,
    settlementResult: SettlementResult
) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult.big ? Choices.big : Choices.small}
            value={settlementResult.big ? translateDotTextMapping[Choices.big] : translateDotTextMapping[Choices.small]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckConditionBankerPlayer = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.banker) {
        value = 1;
    } else if (settlementResult.player) {
        value = 2;
    }
    return value;
};

export const CheckConditionBigSmall = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.big) {
        value = 1;
    }
    return value;
};

export const ScoreboardRule = [
    { elementRound: GetElementRoundBankerPlayer, condition: CheckConditionBankerPlayer },
    { elementRound: GetElementRoundBigSmall, condition: CheckConditionBigSmall },
];
