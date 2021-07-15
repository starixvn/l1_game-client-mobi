import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../keno-pro-max-helper";
import { SettlementResult } from "../keno-pro-max";

export const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translate: Function,
    gameSetting: GameBaseProps
) => {
    const count = countRedDot(result);
    const isEven = checkIsEven(count);
    const isSmall = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isEven ? Choices.even : Choices.odd}
            value={isSmall ? translate(`kenopromax:smallTextDot`) : translate(`kenopromax:bigTextDot`)}
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
