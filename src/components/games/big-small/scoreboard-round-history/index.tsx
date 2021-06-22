import React from "react";

import { checkIsSmall, countRedDot, Choices } from "../big-small-helper";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { useGameContext } from "../../../../contexts/game-context/game-context";

const GetElementRound = (result: any, col: number, row: number, roundId: number, translate: Function) => {
    const { gameSetting } = useGameContext();
    const { id: gameId, gameName } = gameSetting;
    const isSmall = checkIsSmall(countRedDot(result));
    return (
        <RoundDotGrid
            key={`${roundId}_${gameId}`}
            choice={isSmall ? Choices.small : Choices.big}
            col={col}
            row={row}
            value={isSmall ? translate(`${gameName.toLowerCase()}:smallTextDot`) : translate(`${gameName.toLowerCase()}:bigTextDot`)}
        ></RoundDotGrid>
    );
};

export default GetElementRound;
