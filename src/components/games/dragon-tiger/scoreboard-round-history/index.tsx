import React from "react";

import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsDragon, checkIsTie, Choices } from "../dragon-tiger-helper";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    return (
        <RoundDotGrid
            key={roundId}
            choice={isTie ? Choices.tie : isDragon ? Choices.dragon : Choices.tiger}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export default GetElementRound;
