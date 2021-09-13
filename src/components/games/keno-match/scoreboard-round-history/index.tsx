import React from "react";

import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../keno-match-helper";
import { SettlementResult } from "../type";

enum choiceValueMapping {
    blue,
    red,
    tie,
    over,
    under,
    odd,
    even,
}

export const GetScoreboardDotDetailsOfBlueRed: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    settlementResult: SettlementResult;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, settlementResult }) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult?.tie ? "tie-keno-match" : settlementResult?.blue ? Choices.blue : Choices.red}
            value={
                settlementResult?.tie
                    ? translateDotTextMapping[Choices.tie]
                    : settlementResult?.blue
                    ? translateDotTextMapping[Choices.blue]
                    : translateDotTextMapping[Choices.red]
            }
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const ConditionChangeDotOfBlueRed = ({ settlementResult }) => {
    return settlementResult?.tie ? choiceValueMapping.tie : settlementResult?.blue ? choiceValueMapping.blue : choiceValueMapping.red;
};

export const GetScoreboardDotDetailsOfOverUnder: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    settlementResult: SettlementResult;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, settlementResult }) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult?.over ? Choices.over : Choices.under}
            value={settlementResult?.over ? translateDotTextMapping[Choices.over] : translateDotTextMapping[Choices.under]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const ConditionChangeDotOfOverUnder = ({ settlementResult }) => {
    return settlementResult.over ? choiceValueMapping.over : choiceValueMapping.under;
};

export const GetScoreboardDotDetailsOfEvenOdd: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    settlementResult: SettlementResult;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, settlementResult }) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult?.even ? Choices.even : Choices.odd}
            value={settlementResult?.even ? translateDotTextMapping[Choices.even] : translateDotTextMapping[Choices.odd]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const ConditionChangeDotEvenOdd = ({ settlementResult }) => {
    return settlementResult.even ? choiceValueMapping.even : choiceValueMapping.odd;
};

export const ScoreboardRule = [
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfBlueRed,
        conditionChangeDot: ConditionChangeDotOfBlueRed,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfOverUnder,
        conditionChangeDot: ConditionChangeDotOfOverUnder,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfEvenOdd,
        conditionChangeDot: ConditionChangeDotEvenOdd,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfBlueRed,
        conditionChangeDot: ConditionChangeDotOfBlueRed,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfOverUnder,
        conditionChangeDot: ConditionChangeDotOfOverUnder,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsOfEvenOdd,
        conditionChangeDot: ConditionChangeDotEvenOdd,
    },
];
