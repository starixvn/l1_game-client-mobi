import React from "react";
import { SeDieDotNumber, ScoreboardItemNext } from "../dot";
import { SeDieSettlementResult } from "../sedie";
import { Props } from "./scoreboard-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";
import ScoreboardDragon from "../../../shared/round-history/scoreboard/dragon";
import { countRedDot, checkIsEven } from "../mini-round-history";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isEven = checkIsEven(countRedDot(result));
    const count = countRedDot(result);
    return <SeDieDotNumber key={roundId} red={isEven} count={count} col={col} row={row}></SeDieDotNumber>;
};

const checkCondition = (settlementResult: SeDieSettlementResult) => {
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
