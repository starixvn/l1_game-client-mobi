import { useTranslation } from "next-i18next";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import Loader from "../../../shared/loader";
import Styles from "../../../shared/countdown-timer/countdown-timer.module.scss";
import { KenoMatchGameState, KenoMatchGameStateEnum, KenoMatchGameDurations, TimerProps } from "../type";

interface GameStatusWithTimerProps {
    duration: number;
    initialRemainingTime: number;
    lockingBet: boolean;
    isStarBetting: boolean;
}

const KenoCountdownTimer: React.FC = () => {
    const { gameState, remainingTime, gameSetting } = useGameContext(),
        durationSetting = gameSetting.durations as KenoMatchGameDurations,
        { halfTimeDuration, showHalfTimeResult, fullTimeDuration, showFullTimeResult } = durationSetting,
        kenoMatchGameState = gameState as KenoMatchGameState;

    switch (kenoMatchGameState) {
        case KenoMatchGameStateEnum.HalfTimePlacingBet:
            return (
                <GameStatusAndTimer
                    duration={halfTimeDuration}
                    initialRemainingTime={remainingTime - showHalfTimeResult}
                    lockingBet={false}
                    isStarBetting={true}
                />
            );

        case KenoMatchGameStateEnum.FullTimePlacingBet:
            return (
                <GameStatusAndTimer
                    duration={fullTimeDuration}
                    initialRemainingTime={remainingTime - showFullTimeResult}
                    lockingBet={false}
                    isStarBetting={true}
                />
            );

        case KenoMatchGameStateEnum.HalfTimeLockingBet:
            return (
                <GameStatusAndTimer
                    duration={halfTimeDuration}
                    initialRemainingTime={remainingTime - showHalfTimeResult}
                    lockingBet={true}
                    isStarBetting={false}
                />
            );

        case KenoMatchGameStateEnum.FullTimeLockingBet:
            return (
                <GameStatusAndTimer
                    duration={fullTimeDuration}
                    initialRemainingTime={remainingTime - showFullTimeResult}
                    lockingBet={true}
                    isStarBetting={false}
                />
            );

        case KenoMatchGameStateEnum.ShowHalfTimeResult:
        case KenoMatchGameStateEnum.ShowFullTimeResult:
            return <Loader />;
        default:
            return <GameStatusAndShowResult />;
    }
};

function GameStatusAndShowResult() {
    const { t } = useTranslation("common");
    return (
        <>
            <div className="loader-show-result"></div>
            <GameStatus>
                <div className={Styles["open-result"]}>{t("openResult")}</div>
            </GameStatus>
        </>
    );
}

const GameStatusAndTimer = ({ duration, initialRemainingTime, lockingBet, isStarBetting }: GameStatusWithTimerProps) => {
    const { t } = useTranslation("common");
    const content = isStarBetting ? (
        <div className={Styles["start-betting"]}>{t("startBetting")}</div>
    ) : (
        <div className={Styles["no-more-bets"]}>{t("noMoreBets")}</div>
    );

    return (
        <>
            <Timer {...{ duration, initialRemainingTime, lockingBet }} />
            <div className={Styles["game-status"]}>{content}</div>

            <GameStatus>{content}</GameStatus>
        </>
    );
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
        <div className={Styles.timer}>
            <CountdownCircleTimer {...timerProps} colors={[[lockingBet ? "#FF0505" : "#19A32F", 1]]}>
                {({ remainingTime }) => (remainingTime === 0 ? 1 : remainingTime).toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </CountdownCircleTimer>
        </div>
    );
};

const GameStatus: React.FC = ({ children }) => {
    return <div className={Styles["game-status"]}>{children}</div>;
};

export default KenoCountdownTimer;
