import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameState } from "../game-base/type";
import styles from "./countdown-timer.module.scss";

const CountdownTimer: React.FC = () => {
    const { remainingTime, gameState, gameSetting } = useGameContext();
    const { durations } = gameSetting;

    const timerColors = {
        [GameState.LockingBet]: "#FF0000",
        [GameState.InRound]: "#fff",
        [GameState.Waiting]: "#3AA55F",
    };

    const getTimerDuration = (state: GameState) => {
        switch (state) {
            case GameState.LockingBet:
            case GameState.InRound:
                return durations.placingBets;
            case GameState.Waiting:
                return durations.wholeRound - durations.placingBets - durations.beforeStartRound - durations.showResult;
            default:
                return 0;
        }
    };

    const timerProps = {
        isPlaying: true,
        size: 40,
        strokeWidth: 4,
        trailStrokeWidth: 2,
        initialRemainingTime: remainingTime,
        duration: getTimerDuration(gameState),
    };

    return (
        <div className={styles.timer}>
            <CountdownCircleTimer {...timerProps} colors={[[timerColors[gameState], 1]]}>
                {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
        </div>
    );
};

export default CountdownTimer;
