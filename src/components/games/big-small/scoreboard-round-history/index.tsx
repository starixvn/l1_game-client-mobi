import React from "react";
import { BigSmallDotNumber, ScoreboardItemNext } from "../dot";
import { SettlementResult } from "../big-small";
import { Props } from "./scoreboard-round-history";
import ScoreboardDragon from "../../../shared/round-history/scoreboard/dragon";
import { countRedDot, checkIsSmall } from "../mini-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isSmall = checkIsSmall(countRedDot(result));
    const textInner = isSmall ? "M" : "B";
    return <BigSmallDotNumber key={roundId} red={isSmall} textInner={textInner} col={col} row={row}></BigSmallDotNumber>;
};

const checkCondition = (settlementResult: SettlementResult) => {
    let value = 1;
    if (settlementResult.small) {
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
        <ScoreboardRoundHistory>
            <ScoreboardDragon
                roundHistory={roundHistory}
                gameState={gameState}
                getElementRound={getElementRound}
                checkCondition={checkCondition}
                roundNext={roundNext}
            ></ScoreboardDragon>
        </ScoreboardRoundHistory>
    );
};

export default ScoreboardHistory;
