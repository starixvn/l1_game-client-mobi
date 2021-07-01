import React, { useMemo } from "react";
import { RoundHistoryType } from "../../type";
import { Round } from "../../../../../types";
import { Props } from "./types";
import Styles from "../round-history.module.scss";

const drawHistory = <R, S>(roundHistory: Round<R, S>[], getElementRound: (round: R, roundId: number) => void) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getElementRound(round.result, round.roundId);
    });
};

const ScoreboardBasic = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getElementRound } = props;
    return useMemo(() => {
        return (
            <div className={Styles["score-board-container"]}>{drawHistory([...roundHistory.slice(0, 30)].reverse(), getElementRound)}</div>
        );
    }, [roundHistory]);
};

export default ScoreboardBasic;
