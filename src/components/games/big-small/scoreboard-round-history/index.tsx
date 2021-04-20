import React from "react";
import { BigSmallDotNumber } from "../dot";
import { checkIsSmall, countRedDot } from "../big-small-helper";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isSmall = checkIsSmall(countRedDot(result));
    return <BigSmallDotNumber key={roundId} red={isSmall} textInner={""} col={col} row={row}></BigSmallDotNumber>;
};

export default GetElementRound;
