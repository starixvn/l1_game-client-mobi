import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../se-die-helper";
import { SettlementResult } from "../sedie";

export const GetScoreboardDotDetails: React.FC<{
    result: any;
    col: number;
    row: number;
    roundId: number;
    gameSetting: GameBaseProps;
}> = ({ result, col, row, roundId, gameSetting }) => {
    const count = countRedDot(result);
    const isEven = checkIsEven(count);

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isEven ? Choices.even : Choices.odd}
            value={count}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const ConditionChangeDot = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.even) {
        value = 1;
    }
    return value;
};
export default GetScoreboardDotDetails;
