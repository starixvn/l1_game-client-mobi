import React from "react";

import ScoreboardDragon from "../../../shared/round-history/scoreboard/dragon";
import { SettlementResult } from "../big-small";
import { BigSmallDotNumber, ScoreboardItemNext } from "../dot";
import { checkIsSmall, countRedDot } from "../round-history";
import { Props } from "./scoreboard-round-history";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isSmall = checkIsSmall(countRedDot(result));
    const textInner = "";
    return <BigSmallDotNumber key={roundId} red={isSmall} textInner={textInner} col={col} row={row}></BigSmallDotNumber>;
};

const checkCondition = (settlementResult: SettlementResult) => {
    return settlementResult.small ? 0 : 1;
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
