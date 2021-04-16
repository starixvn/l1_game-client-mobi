import React from "react";

import ScoreboardDragon from "../../../shared/round-history/scoreboard/dragon";
import { ScoreboardItemNext, SeDieDotNumber } from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { SettlementResult } from "../sedie";
import { Props } from "./scoreboard-round-history";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const count = countRedDot(result);
    const isEven = checkIsEven(count);

    return <SeDieDotNumber key={roundId} red={isEven} count={count} col={col} row={row}></SeDieDotNumber>;
};

const checkCondition = (settlementResult: SettlementResult) => {
    let value = 1;
    if (settlementResult.even) {
        value = 0;
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
