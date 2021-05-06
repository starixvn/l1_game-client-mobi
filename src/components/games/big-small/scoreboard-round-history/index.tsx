import React from "react";

import { checkIsSmall, countRedDot, Choices } from "../big-small-helper";
import { RoundDotGrid } from "../../../shared/round-history/dot";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isSmall = checkIsSmall(countRedDot(result));
    return <RoundDotGrid key={roundId} choice={isSmall ? Choices.small : Choices.big} col={col} row={row}></RoundDotGrid>;
};

export default GetElementRound;
