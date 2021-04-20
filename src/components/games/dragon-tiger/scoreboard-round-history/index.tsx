import React from "react";
import { DragonTigerDotNumber } from "../dot";
import { ScoreboardItemNext } from "../../../shared/round-history/item-next";
import { SettlementResult } from "../dragon-tiger";
import { Props } from "./scoreboard-round-history";
import ScoreboardDragon from "../../../shared/round-history/scoreboard/dragon";
import { checkIsDragon, checkIsTie } from "../round-history";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    const textInner = "";
    return (
        <DragonTigerDotNumber
            key={roundId}
            choice={{
                dragon: isDragon,
                tiger: !isDragon,
                tie: isTie,
            }}
            textInner={textInner}
            col={col}
            row={row}
        ></DragonTigerDotNumber>
    );
};

const checkCondition = (settlementResult: SettlementResult) => {
    let value = 1;
    if (settlementResult.dragon) {
        value = 0;
    } else if (settlementResult.tie) {
        value = 2;
    }

    return value;
};

const ScoreboardHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    const roundNext = (col: number, row: number) => {
        return <ScoreboardItemNext key={Math.random()} col={col} row={row}></ScoreboardItemNext>;
    };
    return (
        <ScoreboardDragon
            roundHistory={roundHistory}
            gameState={gameState}
            getElementRound={getElementRound}
            checkCondition={checkCondition}
            roundNext={roundNext}
        ></ScoreboardDragon>
    );
};

export default ScoreboardHistory;
