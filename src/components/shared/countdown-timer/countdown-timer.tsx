import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameState } from "../game-base/type";
import styles from "./countdown-timer.module.scss";

const CountdownTimer: React.FC = () => {
    const ctx = useGameContext();
    const { durations } = ctx.gameSetting;

    const timerProps = {
        isPlaying: true,
        size: 40,
        strokeWidth: 4,
        trailColor: "#fff",
        trailStrokeWidth: 1,
        initialRemainingTime: ctx.remainingTime,
        duration: durations.placingBets,
    };

    switch (ctx.gameState) {
        case GameState.InRound:
        case GameState.LockingBet:
            return (
                <div className={styles.timer}>
                    <CountdownCircleTimer
                        {...timerProps}
                        colors={
                            ctx.gameState == GameState.LockingBet
                                ? [["#FF0000", 1]]
                                : [
                                      ["#19A32F", 0.7],
                                      ["#FF5B15", 0.3],
                                  ]
                        }
                    >
                        {({ remainingTime }) => {
                            if (remainingTime === 0) {
                                return (1).toLocaleString("en-US", { minimumIntegerDigits: 2 });
                            }
                            return remainingTime.toLocaleString("en-US", { minimumIntegerDigits: 2 });
                        }}
                    </CountdownCircleTimer>
                </div>
            );
        case GameState.BalancingBet:
            return <div className="loader-balance-pool"></div>;
        default:
            return <div className="loader-show-result"></div>;
    }
};

export default CountdownTimer;
