import React from "react";
import { SeDieDotNumber } from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { SettlementResult } from "../sedie";

export const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const count = countRedDot(result);
    const isEven = checkIsEven(count);

    return <SeDieDotNumber key={roundId} red={isEven} value={count} col={col} row={row}></SeDieDotNumber>;
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.even) {
        value = 1;
    }
    return value;
};
export default GetElementRound;
