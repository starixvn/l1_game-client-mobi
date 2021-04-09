import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameState } from "../game-base/type";
import styles from "./countdown-timer.module.scss";

const CountdownTimer: React.FC = () => {
    const { remainingTime, gameState, gameSetting } = useGameContext();
    const { durations } = gameSetting;

    const getTimerPropsByState = (state: GameState) => {
        switch (state) {
            case GameState.LockingBet:
                return { duration: durations.lockingBet, colors: "#FF0000" };
            case GameState.InRound:
                return { duration: durations.placingBets, colors: "#fff" };
            case GameState.Waiting:
                return {
                    duration: durations.wholeRound - durations.placingBets - durations.beforeStartRound - durations.showResult,
                    colors: "#3AA55F",
                };
        }
    };
    const timerProps = {
        isPlaying: true,
        size: 40,
        strokeWidth: 4,
        trailStrokeWidth: 2,
        initialRemainingTime: remainingTime,
        ...getTimerPropsByState(gameState),
    };

    return (
        <div className={styles.timer}>
            <CountdownCircleTimer {...timerProps}>{({ remainingTime }) => remainingTime}</CountdownCircleTimer>
        </div>
    );
};

export default CountdownTimer;
