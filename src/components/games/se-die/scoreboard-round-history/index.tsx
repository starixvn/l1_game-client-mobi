import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../se-die-helper";

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

export default GetScoreboardDotDetails;
