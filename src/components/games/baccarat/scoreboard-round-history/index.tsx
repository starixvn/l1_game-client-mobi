import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { Result, SettlementResult } from "../baccarat";

export const GetElementRound = (
    result: Result,
    col: number,
    row: number,
    roundId: number,
    translate: Function,
    gameSetting: GameBaseProps,
    settlementResult: SettlementResult
) => {
    const isBanker = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={settlementResult.big ? Choices.big : Choices.small}
            value={
                settlementResult.big
                    ? translate(`${gameSetting.gameName.toLowerCase()}:bigTextDot`)
                    : translate(`${gameSetting.gameName.toLowerCase()}:smallTextDot`)
            }
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.big) {
        value = 1;
    }
    return value;
};
export default GetElementRound;
