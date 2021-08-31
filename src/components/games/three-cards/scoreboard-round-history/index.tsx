import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { SettlementResult, Result, Cards } from "../three-cards";
import IconColumn from "../../../shared/round-history/icon-column";
import Styles from "./three-cards-scoreboard.module.scss";

export const GetScoreboardDotDetailsOfRedBlack: React.FC<{
    col: number;
    row: number;
    roundId: number;
    gameSetting: GameBaseProps;
    settlementResult: SettlementResult;
}> = ({ col, row, roundId, gameSetting, settlementResult }) => {
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult.red ? Choices.red : Choices.black}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

enum choiceValueMapping {
    red,
    black,
}

export const ConditionChangeDotOfRedBlack = ({ settlementResult }) => {
    return settlementResult.red ? choiceValueMapping.red : choiceValueMapping.black;
};

const Suites = ["hearts", "diamonds", "clubs", "spades"];
const SuitIcons = ["hearts", "diamonds", "clubs", "spades"];

export const GetScoreboardDotDetailsOfSuits = (result: Result, roundId: number) => {
    return (
        <IconColumn key={roundId}>
            {result.map((value: Cards, index) => {
                return (
                    <div key={`${roundId}_${index}`} className={Styles["score-board-item"]}>
                        <div className={Styles["symbol-size"]}>
                            <img
                                srcSet={`/static/images/three-cards/${SuitIcons[value.suit]}.png 1x, /static/images/three-cards/${
                                    SuitIcons[value.suit]
                                }@2x.png 2x, /static/images/three-cards/${SuitIcons[value.suit]}@3x.png 3x`}
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

export const ConditionChangeDotOfSuits = ({ settlementResult }) => {
    const choiceValue = GetNameFromChoice(settlementResult);
    return Suites.indexOf(choiceValue);
};

export const ScoreboardRule = [
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfRedBlack, conditionChangeDot: ConditionChangeDotOfRedBlack },
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfSuits, conditionChangeDot: ConditionChangeDotOfSuits },
];
