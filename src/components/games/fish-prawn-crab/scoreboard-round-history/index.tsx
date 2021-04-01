import React from "react";
import { Props } from "./scoreboard-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";
import Item from "../item";
import Styles from "./scoreboard-round-history.module.scss";

const ContainerItem = (props) => {
    return <div className={Styles["container-element"]}>{props.children}</div>;
};

const getElementRound = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    const isLatest = false;
    return (
        <ContainerItem key={roundId}>
            {itemValues.map((value: number, index) => {
                return <Item key={roundId + "_" + index} type={value} isLatest={isLatest}></Item>;
            })}
        </ContainerItem>
    );
};

const ScoreboardComponent: React.FunctionComponent = (props) => {
    return <div className={Styles["round-history-container"]}>{props.children}</div>;
};

const ScoreboardHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    return (
        <ScoreboardComponent>
            <ScoreboardRoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                isDragonTail={false}
                getElementRound={getElementRound}
            ></ScoreboardRoundHistory>
        </ScoreboardComponent>
    );
};

export default ScoreboardHistory;
