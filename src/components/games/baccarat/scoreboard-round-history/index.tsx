import React from "react";
import { GameBaseProps } from "../../../shared/game-base/type";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { SettlementResult } from "../baccarat";

export const GetElementRound = (
    result: any,
    col: number,
    row: number,
    roundId: number,
    translate: Function,
    gameSetting: GameBaseProps
) => {
    const isBanker = true;
    const isBig = true;

    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isBig ? Choices.big : Choices.small}
            value={
                isBanker
                    ? translate(`${gameSetting.gameName.toLowerCase()}:bankerTextDot`)
                    : translate(`${gameSetting.gameName.toLowerCase()}:playerTextDot`)
            }
            col={col}
            row={row}
        ></RoundDotGrid>
    );
};

export const CheckCondition = (settlementResult: SettlementResult) => {
    let value = 0;
    if (settlementResult.big) {
        value = 1;
    }
    return value;
};
export default GetElementRound;
