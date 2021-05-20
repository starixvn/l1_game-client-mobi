import React, { useEffect, useRef } from "react";
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
    const wrapperRefScoreboardBasic = useRef<HTMLDivElement>(null);
    useEffect(() => {
        return () => {
            wrapperRefScoreboardBasic.current = null;
        };
    }, []);

    return (
        <div ref={wrapperRefScoreboardBasic} className={Styles["score-board-container"]}>
            {drawHistory([...roundHistory].reverse(), getElementRound)}
        </div>
    );
};

export default ScoreboardBasic;
