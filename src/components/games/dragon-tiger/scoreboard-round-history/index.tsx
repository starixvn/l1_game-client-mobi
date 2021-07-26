import React from "react";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsDragon, checkIsTie, Choices } from "../dragon-tiger-helper";

const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    settlementResult: any
) => {
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    const choiceName = isTie ? Choices.tie : isDragon ? Choices.dragon : Choices.tiger;
    return <RoundDotGrid key={roundId} choice={choiceName} col={col} row={row} value={translateDotTextMapping[choiceName]}></RoundDotGrid>;
};

export default GetElementRound;
