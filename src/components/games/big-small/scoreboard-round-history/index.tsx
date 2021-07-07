import React from "react";
import { checkIsSmall, countRedDot, Choices } from "../big-small-helper";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { GameBaseProps } from "../../../shared/game-base/type";

const GetElementRound = (result: any, col: number, row: number, roundId: number, translate: Function, gameSetting: GameBaseProps) => {
    const isSmall = checkIsSmall(countRedDot(result));
    return (
        <RoundDotGrid
            key={`${roundId}_${gameSetting.id}`}
            choice={isSmall ? Choices.small : Choices.big}
            col={col}
            row={row}
            value={
                isSmall
                    ? translate(`${gameSetting.gameName.toLowerCase()}:smallTextDot`)
                    : translate(`${gameSetting.gameName.toLowerCase()}:bigTextDot`)
            }
        ></RoundDotGrid>
    );
};

export default GetElementRound;
