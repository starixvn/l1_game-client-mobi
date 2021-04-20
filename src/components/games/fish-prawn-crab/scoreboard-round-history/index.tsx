import React from "react";
import { Props } from "./scoreboard-round-history";
import ScoreboardBasic from "../../../shared/round-history/scoreboard/basic";
import Item from "../item";
import IconColumn from "../../../shared/round-history/icon-column";

const getElementRound = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    return (
        <IconColumn key={roundId}>
            {itemValues.map((value: number, index) => {
                return <Item key={`${roundId}_${index}`} type={value}></Item>;
            })}
        </IconColumn>
    );
};

const ScoreboardHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    return <ScoreboardBasic roundHistory={roundHistory} gameState={gameState} getElementRound={getElementRound}></ScoreboardBasic>;
};

export default ScoreboardHistory;
