import { useTranslation } from "next-i18next";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import {  GameBaseProps } from  "../../../shared/game-base/type";
import Loader from "../../../shared/loader";
import styles from "./countdown-timer.module.scss";

import {
    KenoMatchGameBaseState,
    KenoMatchSettlementResult,
    KenoMatchResult,
    KenoMatchGameState,
    KenoMatchGameDurations,
} from "../type";

const CountdownTimer: React.FC = () => {
    const { kenoMatchGameState } = useGameContext();
    const { t } = useTranslation("common");
    
    switch (kenoMatchGameState) {
        case KenoMatchGameState.BeforeStartRound:
            return <Timer />;
        // case KenoMatchGameState.InRound:
            case KenoMatchGameState.HalfTime:
            case KenoMatchGameState.FullTime:
                return (
                    <>
                        <Timer />
                        <GameStatus>
                            <div className={styles["start-betting"]}>{t("startBetting")}</div>
                        </GameStatus>
                    </>
                );
        case KenoMatchGameState.HalfTimeLockingBet:
        case KenoMatchGameState.FullTimeLockingBet:
            return (
                <>
                    <Timer />
                    <GameStatus>
                        <div className={styles["no-more-bets"]}>{t("noMoreBets")}</div>
                    </GameStatus>
                </>
            );
        // case KenoMatchGameState.BalancingBet:
        //     return (
        //         <>
        //             <div className="loader-balance-pool"></div>
        //             <GameStatus>
        //                 <div className={styles["balanced-betting-pool"]}>{t("balancedBettingPool")}</div>
        //             </GameStatus>
        //         </>
        //     );
       
        case KenoMatchGameState.None:
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

const Timer = () => {
    const ctx = useGameContext();
    const { durations } = ctx.kenoMatchGameSetting;

    const timerProps = {
        isPlaying: ctx.kenoMatchGameState !== KenoMatchGameState.BeforeStartRound,
        size: 30,
        strokeWidth: 3,
        trailColor: "#fff",
        trailStrokeWidth: 1,
        initialRemainingTime: ctx.kenoMatchGameState === KenoMatchGameState.BeforeStartRound ? durations.placingBets : ctx.remainingTime,
        duration: durations.placingBets,
    };

    return (
        <div className={styles.timer}>
            <CountdownCircleTimer {...timerProps} colors={[[ctx.kenoMatchGameState === KenoMatchGameState.FullTimeLockingBet || ctx.kenoMatchGameState === KenoMatchGameState.HalfTimeLockingBet? "#FF0505" : "#19A32F", 1]]}>
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
