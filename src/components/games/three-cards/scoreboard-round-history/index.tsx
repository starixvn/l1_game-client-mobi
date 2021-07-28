import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { SettlementResult, Result, Cards } from "../three-cards";
import IconColumn from "../../../shared/round-history/icon-column";
import Styles from "./three-cards-scoreboard.module.scss";

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

const Suites = ["hearts", "diamonds", "clubs", "spades"];
const SuitIcons = ["heart", "diamond", "club", "spade"];

export const GetElementRoundSuits = (result: Result, roundId: number) => {
    return (
        <IconColumn key={roundId}>
            {result.map((value: Cards, index) => {
                return (
                    <div key={`${roundId}_${index}`} className={Styles["score-board-item"]}>
                        <div className={Styles["symbol-size"]}>
                            <img
                                src={`/static/images/three-cards/${SuitIcons[value.suit]}.svg`}
                                className="img-fluid"
                                width="16"
                                height="16"
                                alt="symbol"
                            />
                        </div>
                    </div>
                );
            })}
        </IconColumn>
    );
};

export const GetNameFromChoice = (settlementResult: SettlementResult) => {
    let choiceValue = Suites.filter((choice) => settlementResult[choice])[0] ?? Choices.diamond;
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
