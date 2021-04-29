import React from "react";
import Styles from "../round-history.module.scss";
import { RoundHistoryType } from "../../type";
import { Round } from "../../../../../types";

type Props<R, S> = {
    roundHistory: Round<R, S>[];
    getElementRound: (round: R, roundId: number) => void;
    gameState: number;
};

const drawHistory = <R, S>(roundHistory: Round<R, S>[], getElementRound: (round: R, roundId: number) => void) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getElementRound(round.result, round.roundId);
    });
};

const ScoreboardBasic = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getElementRound } = props;

    return <div className={Styles["score-board-container"]}>{drawHistory([...roundHistory].reverse(), getElementRound)}</div>;
};

export default ScoreboardBasic;
