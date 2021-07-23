import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../keno-pro-max-helper";
import { SettlementResult } from "../keno-pro-max";

export const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: Function,
    gameSetting: GameBaseProps
) => {
    const isSmall = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isSmall ? Choices.small : Choices.big}
            value={isSmall ? translateDotTextMapping[Choices.small] : translateDotTextMapping[Choices.big]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.even) {
        value = 1;
    }
    return value;
};
export default GetElementRound;
