import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { SettlementResult } from "../baccarat";

enum choiceValueMapping {
    big,
    small,
    banker,
    player,
    tie,
}

export const GetScoreboardDotDetailsOfBankerPlayer: React.FC<{
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

export const ConditionChangeDotOfBankerPlayer = ({ settlementResult }) => {
    return settlementResult.tie ? choiceValueMapping.tie : settlementResult.player ? choiceValueMapping.player : choiceValueMapping.banker;
};

export const ConditionChangeDotOfBigSmall = ({ settlementResult }) => {
    return settlementResult.big ? choiceValueMapping.big : choiceValueMapping.small;
};

export const ScoreboardRule = [
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfBankerPlayer, conditionChangeDot: ConditionChangeDotOfBankerPlayer },
    { GetScoreboardDotDetails: GetScoreboardDotDetailsOfBigSmall, conditionChangeDot: ConditionChangeDotOfBigSmall },
];
