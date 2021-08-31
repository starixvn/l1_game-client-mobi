import React from "react";

import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../keno-match-helper";
import { Result, SettlementResult, KenoMatchRound } from "../type";

enum choiceValueMapping {
    blue,
    red,
    tie,
    over,
    under,
    odd,
    even,
}

export const GetScoreboardDotDetailsFirstHalfOfBlueRed: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.firstHalf?.settlementResult;
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

export const ConditionChangeDotFirstHalfOfBlueRed = ({ round }) => {
    const settlementResult = round?.firstHalf?.settlementResult;
    return settlementResult?.tie ? choiceValueMapping.tie : settlementResult?.blue ? choiceValueMapping.blue : choiceValueMapping.red;
};

export const GetScoreboardDotDetailsFirstHalfOfOverUnder: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.firstHalf?.settlementResult;
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

export const ConditionChangeDotFirstHalfOfOverUnder = ({ round }) => {
    return round?.firstHalf?.settlementResult.over ? choiceValueMapping.over : choiceValueMapping.under;
};

export const GetScoreboardDotDetailsFirstHalfOfEvenOdd: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.firstHalf?.settlementResult;
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

export const ConditionChangeDotFirstHalfOfEvenOdd = ({ round }) => {
    return round?.firstHalf?.settlementResult.even ? choiceValueMapping.even : choiceValueMapping.odd;
};

export const GetScoreboardDotDetailsFullTimeOfBlueRed: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.fullTime?.settlementResult;
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

export const ConditionChangeDotFullTimeOfBlueRed = ({ round }) => {
    const settlementResult = round?.fullTime?.settlementResult;
    return settlementResult?.tie ? choiceValueMapping.tie : settlementResult?.blue ? choiceValueMapping.blue : choiceValueMapping.red;
};

export const GetScoreboardDotDetailsFullTimeOfOverUnder: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.fullTime?.settlementResult;
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

export const ConditionChangeDotFullTimeOfOverUnder = ({ round }) => {
    return round?.fullTime?.settlementResult.over ? choiceValueMapping.over : choiceValueMapping.under;
};

export const GetScoreboardDotDetailsFullTimeOfEvenOdd: React.FC<{
    col: number;
    row: number;
    roundId: number;
    translateDotTextMapping: object;
    gameSetting: GameBaseProps;
    round: KenoMatchRound<Result, SettlementResult>;
}> = ({ col, row, roundId, translateDotTextMapping, gameSetting, round }) => {
    const settlementResult = round?.fullTime?.settlementResult;
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

export const ConditionChangeDotFullTimeOfEvenOdd = ({ round }) => {
    return round?.fullTime?.settlementResult.even ? choiceValueMapping.even : choiceValueMapping.odd;
};

export const ScoreboardRule = [
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFirstHalfOfBlueRed,
        conditionChangeDot: ConditionChangeDotFirstHalfOfBlueRed,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFirstHalfOfOverUnder,
        conditionChangeDot: ConditionChangeDotFirstHalfOfOverUnder,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFirstHalfOfEvenOdd,
        conditionChangeDot: ConditionChangeDotFirstHalfOfEvenOdd,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFullTimeOfBlueRed,
        conditionChangeDot: ConditionChangeDotFullTimeOfBlueRed,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFullTimeOfOverUnder,
        conditionChangeDot: ConditionChangeDotFullTimeOfOverUnder,
    },
    {
        GetScoreboardDotDetails: GetScoreboardDotDetailsFullTimeOfEvenOdd,
        conditionChangeDot: ConditionChangeDotFullTimeOfEvenOdd,
    },
];
