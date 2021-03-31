import React from "react";
import { SettlementResult } from "../fish-prawn-crab.d";
import { Props } from "./scoreboard-round-history";
import ScoreboardRoundHistory from "../../../shared/round-history/scoreboard";
import Styles from "./scoreboard-round-history.module.scss";

const getElementRound = (result: any, roundId: number) => {
    const keys = Object.values(result);
    return (
        <ContainerItem>
            {keys.forEach((value) => {
                return <Item key={roundId} type={value}></Item>;
            })}
        </ContainerItem>
    );
};

const Item = ({ type }) => {
    let iconName = "";
    switch (type) {
        case 1:
            iconName = "icon-bau";
            break;
        case 2:
            iconName = "icon-ga";
            break;
        case 3:
            iconName = "icon-ca";
            break;
        case 4:
            iconName = "icon-cua";
            break;
        case 5:
            iconName = "icon-tom";
            break;
        default:
            iconName = "icon-nai";
            break;
    }
    return <div className={`${Styles.icon} ${iconName}`}></div>;
};

const ContainerItem = (props) => {
    return <div className={Styles.container}>{props.children}</div>;
};

const ScoreboardComponent = (props) => {
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
