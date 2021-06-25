import React from "react";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsDragon, checkIsTie, Choices } from "../dragon-tiger-helper";
import { useGameContext } from "../../../../contexts/game-context/game-context";

const GetElementRound = (result: any, col: number, row: number, roundId: number, translate: Function) => {
    const { gameSetting } = useGameContext();
    const { id: gameId } = gameSetting;
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    return (
        <RoundDotGrid
            key={`${roundId}_${gameId}`}
            choice={isTie ? Choices.tie : isDragon ? Choices.dragon : Choices.tiger}
            col={col}
            row={row}
            value={
                isTie
                    ? translate("dragontiger:tieTextDot")
                    : isDragon
                    ? translate("dragontiger:dragonTextDot")
                    : translate("dragontiger:tigerTextDot")
            }
        ></RoundDotGrid>
    );
};

export default GetElementRound;
