import React from "react";
import { Props } from "./scoreboard-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";
import ScoreboardBasic from "../../../shared/round-history/scoreboard/basic";
import Item from "../item";

const ContainerItem = (props) => {
    return <div className="score-board-col">{props.children}</div>;
};

const getElementRound = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    const isLatest = false;
    return (
        <ContainerItem key={roundId}>
            {itemValues.map((value: number, index) => {
                return <Item key={roundId + "_" + index} type={value}></Item>;
            })}
        </ContainerItem>
    );
};

const ScoreboardHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    return (
        <ScoreboardRoundHistory>
            <ScoreboardBasic roundHistory={roundHistory} gameState={gameState} getElementRound={getElementRound}></ScoreboardBasic>
        </ScoreboardRoundHistory>
    );
};

export default ScoreboardHistory;
