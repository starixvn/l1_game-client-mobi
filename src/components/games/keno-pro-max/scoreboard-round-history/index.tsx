import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices, ConditionChangeDotOfFiveElements, GetNameFromChoice } from "../keno-pro-max-helper";
import { SettlementResult } from "../keno-pro-max";

enum choiceValueMapping {
    big,
    small,
    odd,
    even,
    gold,
    wood,
    water,
    fire,
    earth,
}

export const GetScoreboardDotDetailsOfBigSmall: React.FC<{
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
            choice={settlementResult.big ? Choices.big : Choices.small}
            value={settlementResult.big ? translateDotTextMapping[Choices.big] : translateDotTextMapping[Choices.small]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const GetScoreboardDotDetailsOfOddEven: React.FC<{
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
            choice={
                settlementResult.odd
                    ? `${Choices.odd}-${gameSetting.gameName.toLowerCase()}`
                    : `${Choices.even}-${gameSetting.gameName.toLowerCase()}`
            }
            value={settlementResult.odd ? translateDotTextMapping[Choices.odd] : translateDotTextMapping[Choices.even]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const GetScoreboardDotDetailsOfFiveElements: React.FC<{
    col: number;
    row: number;
    roundId: number;
    gameSetting: GameBaseProps;
    settlementResult: SettlementResult;
}> = ({ col, row, roundId, gameSetting, settlementResult }) => {
    return (
        <RoundDotGrid key={`${roundId}_${gameSetting.id}`} choice={GetNameFromChoice(settlementResult)} col={col} row={row}></RoundDotGrid>
    );
};

export const ConditionChangeDotOfBigSmall = (settlementResult: SettlementResult) => {
    return settlementResult.big ? choiceValueMapping.big : choiceValueMapping.small;
};

export const ConditionChangeDotOfOddEven = (settlementResult: SettlementResult) => {
    return settlementResult.odd ? choiceValueMapping.odd : choiceValueMapping.even;
};

export const ScoreboardRule = [
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfBigSmall, conditionChangeDot: ConditionChangeDotOfBigSmall },
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfOddEven, conditionChangeDot: ConditionChangeDotOfOddEven },
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfFiveElements, conditionChangeDot: ConditionChangeDotOfFiveElements },
];
