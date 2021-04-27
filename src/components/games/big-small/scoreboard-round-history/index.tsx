import React from "react";

import { checkIsSmall, countRedDot } from "../big-small-helper";
import { BigSmallDotNumber } from "../dot";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isSmall = checkIsSmall(countRedDot(result));
    return <BigSmallDotNumber key={roundId} red={isSmall} col={col} row={row}></BigSmallDotNumber>;
};

export default GetElementRound;
