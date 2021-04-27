import React from "react";

import { DragonTigerDotNumber } from "../dot";
import { checkIsDragon, checkIsTie } from "../dragon-tiger-helper";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    return (
        <DragonTigerDotNumber
            key={roundId}
            choice={{
                dragon: isDragon,
                tiger: !isDragon,
                tie: isTie,
            }}
            col={col}
            row={row}
        ></DragonTigerDotNumber>
    );
};

export default GetElementRound;
