import React from "react";
import Styles from "../round-history.module.scss";
import { RoundHistoryType } from "../../type";

type Props = {
    roundHistory: any[];
    getElementRound: Function;
    gameState: number;
};

const drawHistory = (roundHistory, getElementRound) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getElementRound(round.result, round.roundId);
    });
};

const ScoreboardBasic = (props: Props) => {
    const { roundHistory, getElementRound } = props;

    return <div className={Styles["score-board-container"]}>{drawHistory([...roundHistory].reverse(), getElementRound)}</div>;
};

export default ScoreboardBasic;
