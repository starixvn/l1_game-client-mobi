import React from "react";
import { SeDieDotNumber } from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";

export const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const count = countRedDot(result);
    const isEven = checkIsEven(count);

    return <SeDieDotNumber key={roundId} red={isEven} count={count} col={col} row={row}></SeDieDotNumber>;
};
export default GetElementRound;
