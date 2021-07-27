import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices, CheckConditionFiveElements, GetNameFromChoice } from "../keno-pro-max-helper";
import { Result, SettlementResult } from "../keno-pro-max";

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

export const GetElementRoundOddEven = (
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

export const GetElementRoundFiveElements = (
    result: Result,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    gameSetting: GameBaseProps,
    settlementResult: SettlementResult
) => {
    return (
        <RoundDotGrid key={`${roundId}_${gameSetting.id}`} choice={GetNameFromChoice(settlementResult)} col={col} row={row}></RoundDotGrid>
    );
};

export const CheckConditionBigSmall = (settlementResult: SettlementResult) => {
    return settlementResult.big ? choiceValueMapping.big : choiceValueMapping.small;
};

export const CheckConditionOddEven = (settlementResult: SettlementResult) => {
    return settlementResult.odd ? choiceValueMapping.odd : choiceValueMapping.even;
};

export const ScoreboardRule = [
    { elementRound: GetElementRoundBigSmall, condition: CheckConditionBigSmall },
    { elementRound: GetElementRoundOddEven, condition: CheckConditionOddEven },
    { elementRound: GetElementRoundFiveElements, condition: CheckConditionFiveElements },
];
