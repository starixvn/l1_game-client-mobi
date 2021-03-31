import React from "react";
import { SeDieDotNumber, ScoreboardItemNext } from "../dot";
import { SettlementResult } from "../sedie";
import { Props } from "./scoreboard-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";
import { countRedDot, checkIsEven } from "../mini-round-history";
import Styles from "./scoreboard-round-history.module.scss";

const getElementRound = (result: any, col: number, row: number, roundId: number) => {
    const isEven = checkIsEven(countRedDot(result));
    const count = countRedDot(result);
    return <SeDieDotNumber key={roundId} red={isEven} count={count} col={col} row={row}></SeDieDotNumber>;
};

const checkCondition = (settlementResult: SettlementResult) => {
    let value = 1;
    if (settlementResult.even) {
        value = 0;
    }
    return value;
};

const ScoreboardComponent = (props) => {
    return <div className={Styles["round-history-container"]}>{props.children}</div>;
};

const ScoreboardHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    const roundNext = (col: number, row: number) => {
        return <ScoreboardItemNext key={Math.random()} col={col} row={row}></ScoreboardItemNext>;
    };
    return (
        <ScoreboardComponent>
            <ScoreboardRoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                isDragonTail={true}
                getElementRound={getElementRound}
                checkCondition={checkCondition}
                roundNext={roundNext}
            ></ScoreboardRoundHistory>
        </ScoreboardComponent>
    );
};

export default ScoreboardHistory;
