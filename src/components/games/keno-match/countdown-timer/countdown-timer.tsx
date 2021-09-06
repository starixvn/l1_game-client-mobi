import { useTranslation } from "next-i18next";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import Loader from "../../../shared/loader";
import styles from "./countdown-timer.module.scss";

import { KenoMatchGameState, KenoMatchGameStateEnum, KenoMatchGameDurations, TimerProps } from "../type";

const CountdownTimer: React.FC = () => {
    const { gameState, remainingTime, gameSetting } = useGameContext(),
        durationSetting = gameSetting.durations as KenoMatchGameDurations,
        { halfTimeDuration, showHalfTimeResult, fullTimeDuration, showFullTimeResult } = durationSetting;

    const kenoMatchGameState = gameState as KenoMatchGameState;
    const { t } = useTranslation("common");

    switch (kenoMatchGameState) {
        case KenoMatchGameStateEnum.HalfTimePlacingBet:
            return (
                <>
                    <Timer duration={halfTimeDuration} initialRemainingTime={remainingTime - showHalfTimeResult} lockingBet={false} />
                    <GameStatus>
                        <div className={styles["start-betting"]}>{t("startBetting")}</div>
                    </GameStatus>
                </>
            );

        case KenoMatchGameStateEnum.FullTimePlacingBet:
            return (
                <>
                    <Timer duration={fullTimeDuration} initialRemainingTime={remainingTime - showFullTimeResult} lockingBet={false} />
                    <GameStatus>
                        <div className={styles["start-betting"]}>{t("startBetting")}</div>
                    </GameStatus>
                </>
            );
        case KenoMatchGameStateEnum.HalfTimeLockingBet:
            return (
                <>
                    <Timer duration={halfTimeDuration} initialRemainingTime={remainingTime - showHalfTimeResult} lockingBet={true} />

                    <GameStatus>
                        <div className={styles["no-more-bets"]}>{t("noMoreBets")}</div>
                    </GameStatus>
                </>
            );
        case KenoMatchGameStateEnum.FullTimeLockingBet:
            return (
                <>
                    <Timer duration={fullTimeDuration} initialRemainingTime={remainingTime - showFullTimeResult} lockingBet={true} />
                    <GameStatus>
                        <div className={styles["no-more-bets"]}>{t("noMoreBets")}</div>
                    </GameStatus>
                </>
            );
        case KenoMatchGameStateEnum.ShowHalfTimeResult:
        case KenoMatchGameStateEnum.ShowFullTimeResult:
            return <Loader />;
        default:
            return (
                <>
                    <div className="loader-show-result"></div>
                    <GameStatus>
                        <div className={styles["open-result"]}>{t("openResult")}</div>
                    </GameStatus>
                </>
            );
    }
};

const Timer = ({ duration, initialRemainingTime, lockingBet }: TimerProps) => {
    const timerProps = {
        isPlaying: true,
        size: 30,
        strokeWidth: 3,
        trailColor: "#fff",
        trailStrokeWidth: 1,
        initialRemainingTime,
        duration,
    };

    return (
        <div className={styles.timer}>
            <CountdownCircleTimer {...timerProps} colors={[[lockingBet ? "#FF0505" : "#19A32F", 1]]}>
                {({ remainingTime }) => {
                    if (remainingTime === 0) {
                        return (1).toLocaleString("en-US", { minimumIntegerDigits: 2 });
                    }
                    return remainingTime.toLocaleString("en-US", { minimumIntegerDigits: 2 });
                }}
            </CountdownCircleTimer>
        </div>
    );
};

const GameStatus: React.FC = ({ children }) => {
    return <div className={styles["game-status"]}>{children}</div>;
};

export default CountdownTimer;
