import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { SettlementResult, Result } from "../three-cards";

export const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    gameSetting: GameBaseProps
) => {
    const isBlack = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isBlack ? Choices.black : Choices.red}
            value={isBlack ? translateDotTextMapping[Choices.black] : translateDotTextMapping[Choices.red]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    return settlementResult.black ? 1 : 0;
};

export const GetElementRoundRedBlack = (
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
            choice={settlementResult.red ? Choices.red : Choices.black}
            value={settlementResult.red ? translateDotTextMapping[Choices.red] : translateDotTextMapping[Choices.black]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

enum choiceValueMapping {
    red,
    black,
}

export const CheckConditionRedBlack = (settlementResult: SettlementResult) => {
    return settlementResult.red ? choiceValueMapping.red : choiceValueMapping.black;
};

const Suites = ["diamonds", "hearts", "spades", "clubs"];
export const GetElementRoundSuits = (
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

export const GetNameFromChoice = (settlementResult: SettlementResult) => {
    let choiceValue = Suites.filter((choice) => settlementResult[choice])[0] ?? Choices.diamonds;
    return choiceValue;
};

export const CheckConditionSuits = (settlementResult: SettlementResult) => {
    let choiceValue = GetNameFromChoice(settlementResult);
    return Suites.indexOf(choiceValue);
};

export const ScoreboardRule = [
    { elementRound: GetElementRoundRedBlack, condition: CheckConditionRedBlack },
    { elementRound: GetElementRoundSuits, condition: CheckConditionSuits },
];


export default GetElementRound;
