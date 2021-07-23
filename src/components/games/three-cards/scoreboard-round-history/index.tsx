import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { SettlementResult } from "../three-cards";

export const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translateDotTextMapping: object,
    gameSetting: GameBaseProps
) => {
    const isBlack = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isBlack ? Choices.black : Choices.red}
            value={isBlack ? translateDotTextMapping[Choices.black] : translateDotTextMapping[Choices.red]}
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.black) {
        value = 1;
    }
    return value;
};
export default GetElementRound;
