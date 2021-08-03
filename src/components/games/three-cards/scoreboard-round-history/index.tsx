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
const SuitIcons = ["hearts", "diamonds", "clubs", "spades"];

export const GetElementRoundSuits = (result: Result, roundId: number) => {
    return (
        <IconColumn key={roundId}>
            {result.map((value: Cards, index) => {
                return (
                    <div key={`${roundId}_${index}`} className={Styles["score-board-item"]}>
                        <div className={Styles["symbol-size"]}>
                            <img
                                srcSet={`/static/images/three-cards/${SuitIcons[value.suit]}.png 1x, /static/images/three-cards/${
                                    SuitIcons[value.suit]
                                }.png 2x, /static/images/three-cards/${SuitIcons[value.suit]}.png 3x`}
                                className="img-fluid"
                                width="22"
                                height="22"
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
    return Suites.filter((choice) => settlementResult[choice])[0] ?? Choices.diamonds;
};

export const CheckConditionSuits = (settlementResult: SettlementResult) => {
    const choiceValue = GetNameFromChoice(settlementResult);
    return Suites.indexOf(choiceValue);
};

export const ScoreboardRule = [
    { elementRound: GetElementRoundRedBlack, condition: CheckConditionRedBlack },
    { elementRound: GetElementRoundSuits, condition: CheckConditionSuits },
];
