import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { RoundKenoMatchBase } from "../../../types";
import BaseDialog from "../../shared/base-dialog";
import { ModalType } from "../../shared/base-dialog/type";
import GameBase from "../../shared/game-base";
import { GameState, PopupType, WinStreakCollectorModel } from "../../shared/game-base/type";
import GameHeader from "../../shared/game-header";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import KenoMatchBetOptions from "./bet-options";
import KenoCountdownTimer from "./countdown-timer";
import Styles from "./game.module.scss";
import { Choices, defaultResult, FakeSettlementResult, StatisticRuleMapping } from "./keno-match-helper";
import MainFrameResult from "./round-result/main-frame-result";
import PopupResult from "./round-result/popup-result";
import { ScoreboardRule } from "./scoreboard-round-history";
import {
    KenoMatchGameBaseState,
    KenoMatchGameDurations,
    KenoMatchGameState,
    KenoMatchGameStateEnum,
    KenoMatchProps,
    KenoMatchRound,
    Result,
    SeparateRoundHistoryProps,
    SettlementResult,
    TimeMatch,
} from "./type";

export class KenoMatch extends GameBase<KenoMatchProps, KenoMatchGameBaseState<Result, SettlementResult>> {
    protected showResultInfoH1Timeout: NodeJS.Timeout;
    private winStreakCollectorFH: WinStreakCollectorModel;
    private winStreakCollectorFT: WinStreakCollectorModel;

    constructor(props: KenoMatchProps) {
        super(props);

        this.state = {
            ...this.defaultState,
            ...{
                roundHistory: [],
                liveOdds: null,
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultPopup: defaultResult,
                fullTimeResultPopup: defaultResult,
                isActiveLiveFullTime: false,
                isShowBlinkFH: false,
                isShowBlinkFT: false,
                roundHistoryFH: [],
                roundHistoryFT: [],
            },
        };

        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    onDestroy() {
        super.onDestroy();
        this.clearTimeout();
        this.socket && this.socket.disconnect();
    }

    clearTimeout = () => {
        this.showResultInfoH1Timeout && clearTimeout(this.showResultInfoH1Timeout);
        this.showResultInfoTimeout && clearTimeout(this.showResultInfoTimeout);
        this.showWinningAnimationTimeout && clearTimeout(this.showWinningAnimationTimeout);
    };

    retryConnect = () => {
        this.onStart();
    };

    getMainOptions(): string[] {
        return ["blue", "red", "over", "under", "odd", "even"];
    }

    copyToClipboard(event: any) {
        event.preventDefault();

        const { md5, resultKey, showResultKey } = this.state;
        navigator.clipboard.writeText(showResultKey ? resultKey : md5);
    }

    renderBetOptions() {
        const {
                md5,
                resultKey,
                showResultKey,
                halfTimeResult,
                fullTimeResult,
                gameState,
                settlementResult,
                isActiveLiveFullTime,
                showWinningAnimation,
                liveOdds,
            } = this.state,
            kenoMatchGameState = gameState as KenoMatchGameState;

        const betOptionsProps = {
            liveOdds,
            gameState,
            settlementResult: settlementResult ?? FakeSettlementResult,
            isShowWinningEffect: showWinningAnimation,
            isActiveLiveFullTime: isActiveLiveFullTime,
        };
        const md5Text = showResultKey ? `Key: ${resultKey}` : `MD5: ${md5}`;

        return (
            <div>
                {(kenoMatchGameState === KenoMatchGameStateEnum.HalfTimeLockingBet ||
                    kenoMatchGameState === KenoMatchGameStateEnum.FullTimeLockingBet) && <div className="overlay-mask"></div>}
                <MainFrameResult
                    {...{ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName: this.props.gameName.toLocaleLowerCase() }}
                />
                {this.props.supportMD5 && (
                    <div className={Styles["md5-section"]}>
                        <span className={Styles["text"]}>{md5Text}</span>
                        <div className={Styles["copy-box"]}>
                            <button type="button" onClick={this.copyToClipboard} className={Styles["copy-icon"]}></button>
                        </div>
                    </div>
                )}
                <KenoMatchBetOptions {...betOptionsProps} />
            </div>
        );
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            firstHalfBlueRed: {
                tabName: this.getGameTranslate("firstHalfBlueRed"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["blue", "red", "tie"], timeMatch: TimeMatch.FH }),
            },
            firstHalfOverUnder: {
                tabName: this.getGameTranslate("firstHalfOverUnder"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["over", "under"], timeMatch: TimeMatch.FH }),
            },
            firstHalfEvenOdd: {
                tabName: this.getGameTranslate("firstHalfEvenOdd"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["even", "odd"], timeMatch: TimeMatch.FH }),
            },
            fullTimeBlueRed: {
                tabName: this.getGameTranslate("fullTimeBlueRed"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["blue", "red", "tie"], timeMatch: TimeMatch.FT }),
            },
            fullTimeOverUnder: {
                tabName: this.getGameTranslate("fullTimeOverUnder"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["over", "under"], timeMatch: TimeMatch.FT }),
            },
            fullTimeEvenOdd: {
                tabName: this.getGameTranslate("fullTimeEvenOdd"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["even", "odd"], timeMatch: TimeMatch.FT }),
            },
        };
        return (
            <ScoreboardTab
                key={this.state.roundId}
                tabsValue={sourceTabsValue}
                activeScoreboardTab={this.state.activeScoreboardTab}
                customClassName={"keno-match"}
            ></ScoreboardTab>
        );
    }

    renderStatistic() {
        const { activeScoreboardTab, roundHistoryFH, roundHistoryFT } = this.state;
        const getRoundHistory = () => {
            switch (activeScoreboardTab) {
                case 0:
                case 1:
                case 2:
                    return roundHistoryFH;
                case 3:
                case 4:
                case 5:
                    return roundHistoryFT;
            }
        };
        return (
            <StatisticFollowPercent
                roundHistory={getRoundHistory()}
                statisticRuleEntries={StatisticRuleMapping[this.state.activeScoreboardTab]}
                activeScoreboardTab={this.state.activeScoreboardTab}
            ></StatisticFollowPercent>
        );
    }

    renderBoard() {
        const { activeScoreboardTab, isShowBlinkFH, isShowBlinkFT, roundHistoryFH, roundHistoryFT } = this.state;
        const translateDotTextMapping = {
            [Choices.blue]: this.getGameTranslate("blueTextDot"),
            [Choices.red]: this.getGameTranslate("redTextDot"),
            [Choices.tie]: this.getGameTranslate("tieTextDot"),
            [Choices.over]: this.getGameTranslate("overTextDot"),
            [Choices.under]: this.getGameTranslate("underTextDot"),
            [Choices.even]: this.getGameTranslate("evenTextDot"),
            [Choices.odd]: this.getGameTranslate("oddTextDot"),
        };
        const getDataFollowTabActive = () => {
            switch (activeScoreboardTab) {
                case 0:
                case 1:
                case 2:
                    return { roundHistory: roundHistoryFH, isShowBlink: isShowBlinkFH };
                case 3:
                case 4:
                case 5:
                    return { roundHistory: roundHistoryFT, isShowBlink: isShowBlinkFT };
            }
        };

        return (
            <ScoreboardDragon
                roundHistory={getDataFollowTabActive().roundHistory}
                getDotDetails={ScoreboardRule[activeScoreboardTab]?.GetScoreboardDotDetails}
                conditionChangeDot={ScoreboardRule[activeScoreboardTab]?.conditionChangeDot}
                translateDotTextMapping={translateDotTextMapping}
                isShowBlink={getDataFollowTabActive().isShowBlink}
            />
        );
    }

    renderStartRoundAnimation() {
        return <></>;
    }

    renderResult() {
        return <></>;
    }

    renderResultCollapse() {
        return <></>;
    }

    renderSettlementInfo() {
        return <div className={Styles["result-container"]}></div>;
    }

    registerMessageHandler() {
        super.registerMessageHandler();
        this.messageTransmitter.register("firstHalfResult", this.handleFinishHalfTime.bind(this));
        this.messageTransmitter.register("liveOdds", this.handleLiveOdds.bind(this));
        this.messageTransmitter.register("md5", this.handleMD5.bind(this));
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;

        if (gameState === GameState.None || !this.isUMInFirstLoad) {
            this.runGame(remainingTime);
        }
    }

    handleGamePlay(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;

        if (remainingTime === durations.resetResult) {
            this.setState({
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultPopup: defaultResult,
                fullTimeResultPopup: defaultResult,
            });
        }

        const newGameState = this.determineGameState(remainingTime);
        // console.log(`${KenoMatchGameStateEnum[newGameState]}`);

        const gameState = this.state.gameState as KenoMatchGameState;
        if (gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                ...this.getStateByNextGameState(newGameState),
            };

            this.setState(newState as any);
        }
    }

    determineGameState(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;

        // console.log(`--------------`);
        // console.log(`${remainingTime}s`);
        // console.log(JSON.stringify(durations, null, 2));

        switch (true) {
            case remainingTime > durations.showFullTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowFullTimeResult;
            case remainingTime > durations.highLightFullTime:
                return KenoMatchGameStateEnum.ShowFullTimeSettlementResult;
            case remainingTime > durations.halfTimePlacingBets:
                return KenoMatchGameStateEnum.HighLightFullTime;
            case remainingTime > durations.halfTimeLockingBet:
                return KenoMatchGameStateEnum.HalfTimePlacingBet;
            case remainingTime > durations.showHalfTimeResult:
                return KenoMatchGameStateEnum.HalfTimeLockingBet;
            case remainingTime > durations.showHalfTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowHalfTimeResult;
            case remainingTime > durations.highLightFirstHalf:
                return KenoMatchGameStateEnum.ShowHalfTimeSettlementResult;
            case remainingTime > durations.beforeStartFullTimePlacingBet:
                return KenoMatchGameStateEnum.HighLightFirstHalf;
            case remainingTime > durations.fullTimePlacingBets:
                return KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet;
            case remainingTime > durations.fullTimeLockingBet:
                return KenoMatchGameStateEnum.FullTimePlacingBet;
            case remainingTime >= durations.showFullTimeResult:
                return KenoMatchGameStateEnum.FullTimeLockingBet;

            default:
                return KenoMatchGameStateEnum.None;
        }
    }

    getTimeCounter(remainingTime: number, gameState: KenoMatchGameState) {
        switch (gameState) {
            case KenoMatchGameStateEnum.HalfTimePlacingBet:
            case KenoMatchGameStateEnum.HalfTimeLockingBet:
            case KenoMatchGameStateEnum.FullTimePlacingBet:
            case KenoMatchGameStateEnum.FullTimeLockingBet:
                return remainingTime;
            default:
                return 0;
        }
    }

    getStateByNextGameState(nextGameState: KenoMatchGameStateEnum): any {
        const { roundId, displayPopup, notice, fullTimeResultPopup, halfTimeResultPopup, settlementResultPopup } = this.state;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet || nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet) {
            this.betWin = 0;
        }

        const newStateDetector = [
            {
                condition: [
                    KenoMatchGameStateEnum.BeforeStartRound,
                    KenoMatchGameStateEnum.HalfTimePlacingBet,
                    KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet,
                    KenoMatchGameStateEnum.FullTimePlacingBet,
                ].includes(nextGameState),
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWinningAnimation: false,
                    isShowBlinkFH: false,
                    isShowBlinkFT: false,
                    playResultAnimation: false,
                    showResultInfo: false,
                    betPercentage: {},
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet,
                state: {
                    roundId: roundId + 1,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet,
                state: {
                    isActiveLiveFullTime: true,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet,
                state: {
                    isActiveLiveFullTime: false,
                },
            },
            {
                condition:
                    nextGameState === KenoMatchGameStateEnum.ShowHalfTimeSettlementResult ||
                    nextGameState === KenoMatchGameStateEnum.ShowFullTimeSettlementResult,
                state: {
                    halfTimeResult: halfTimeResultPopup,
                    fullTimeResult: fullTimeResultPopup,
                    settlementResult: settlementResultPopup,
                },
            },
            {
                condition:
                    nextGameState === KenoMatchGameStateEnum.FullTimeLockingBet ||
                    nextGameState === KenoMatchGameStateEnum.HalfTimeLockingBet,
                state: {
                    displayPopup: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : displayPopup,
                    notice: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : notice,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.HalfTimeLockingBet,
                state: {
                    isShowBlinkFH: true,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.FullTimeLockingBet,
                state: {
                    isShowBlinkFT: true,
                },
            },
        ];

        return newStateDetector.reduce(
            (newState, stateDetector) => {
                if (stateDetector.condition) {
                    newState = Object.assign(newState, stateDetector.state);
                }

                return newState;
            },
            { remainingTime: timeCounter }
        );
    }

    getOddsByChoice(choice: string) {
        const { gameConfigs, liveOdds } = this.state;

        return liveOdds?.[choice] ?? gameConfigs.odds[choice];
    }

    handleRoundHistory({ roundHistory, roundId, firstHalfResult }) {
        const { gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;
        const roundIdCurrent =
            kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeResult ||
            kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeSettlementResult ||
            kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeResult ||
            kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeSettlementResult
                ? roundId - 1
                : roundId;
        const rounds: SeparateRoundHistoryProps = this.separateRoundHistory({ roundHistory, firstHalfResult, roundIdCurrent });

        const sourceState = {
            roundHistory: roundHistory,
            roundId: roundIdCurrent,
            roundHistoryFH: rounds.roundHistoryFH,
            roundHistoryFT: rounds.roundHistoryFT,
        };

        this.setState(sourceState);
    }

    separateRoundHistory = ({ roundHistory, firstHalfResult, roundIdCurrent }) => {
        const rounds = {
            roundHistoryFH: [],
            roundHistoryFT: [],
        };

        roundHistory.forEach((round: KenoMatchRound<Result, SettlementResult>) => {
            rounds.roundHistoryFH.push({ ...round.firstHalf, roundId: round.roundId, odds: round.odds });
            rounds.roundHistoryFT.push({ ...round.fullTime, roundId: round.roundId, odds: round.odds });
        });

        if (firstHalfResult && rounds.roundHistoryFH[0]?.roundId !== roundIdCurrent) {
            rounds.roundHistoryFH = this.handleRoundHistoryFH({
                firstHalfResult,
                roundHistoryFH: rounds.roundHistoryFH,
                roundId: roundIdCurrent,
            });
        }

        return rounds;
    };

    handleMD5({ md5 }) {
        this.setState({
            md5: md5,
            showResultKey: false,
        });
    }

    handleFinishHalfTime({ firstHalfResult }) {
        const { roundHistoryFH, roundId, gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;
        const roundHistoryFHClone =
            roundHistoryFH[0]?.roundId !== roundId
                ? this.handleRoundHistoryFH({ firstHalfResult, roundHistoryFH, roundId })
                : roundHistoryFH;

        this.storeOwnBet(roundId);
        this.setState({
            halfTimeResultPopup: firstHalfResult.result,
            settlementResultPopup: firstHalfResult.settlementResult,
            resultKey: firstHalfResult.resultKey,
            showResultKey: true,
            playResultAnimation: true,
        });

        const animationDuration = this.getFinishAnimationDuration();
        this.showResultInfoH1Timeout = setTimeout(() => {
            this.setState({ roundHistoryFH: roundHistoryFHClone, isShowBlinkFH: false, playResultAnimation: false, showResultInfo: true });
            this.notifyWinStreakByLatestSettlementResultTimeMatch(firstHalfResult.settlementResult, TimeMatch.FH);
        }, animationDuration);

        if (
            kenoMatchGameState === KenoMatchGameStateEnum.FullTimePlacingBet ||
            kenoMatchGameState === KenoMatchGameStateEnum.FullTimeLockingBet ||
            kenoMatchGameState === KenoMatchGameStateEnum.ShowFullTimeResult ||
            kenoMatchGameState === KenoMatchGameStateEnum.ShowFullTimeSettlementResult
        ) {
            this.setState({
                halfTimeResult: firstHalfResult.result,
                resultKey: firstHalfResult.resultKey,
                showResultKey: true,
            });
        }
    }

    handleRoundHistoryFH = ({ firstHalfResult, roundHistoryFH, roundId }) => {
        const roundHistoryFHClone = [...roundHistoryFH];
        roundHistoryFHClone.unshift({ ...firstHalfResult, roundId: roundId } as RoundKenoMatchBase<Result, SettlementResult>);
        roundHistoryFHClone.length > 100 && roundHistoryFHClone.pop();

        return roundHistoryFHClone;
    };

    handleLiveOdds({ liveOdds }) {
        this.setState({ liveOdds });
    }

    handleFinish({ finish }) {
        const { roundHistoryFT } = this.state;
        const roundHistoryFTClone = [...roundHistoryFT];

        this.isProcessingBet = false;
        this.clearRetryInterval();
        roundHistoryFTClone.unshift(finish);
        roundHistoryFTClone.length > 100 && roundHistoryFTClone.pop();

        this.setState({
            fullTimeResultPopup: finish.result,
            settlementResultPopup: finish.settlementResult,
            liveOdds: null,
            resultKey: finish.resultKey,
            showResultKey: true,
            playResultAnimation: true,
        });

        const animationDuration = this.getFinishAnimationDuration();

        this.showResultInfoTimeout = setTimeout(() => {
            this.setState({
                showResultInfo: true,
                isShowBlinkFT: false,
                roundHistoryFT: roundHistoryFTClone,
                playResultAnimation: false,
            });
            this.notifyWinStreakByLatestSettlementResultTimeMatch(finish.settlementResult, TimeMatch.FT);
        }, animationDuration);

        this.showWinningAnimationTimeout = setTimeout(() => {
            this.setState({
                showWinningAnimation: true,
            });
        }, this.winningAnimationWaitingTimeInSecond);
    }

    initWinStreakCollector() {
        const mainOptions = this.getMainOptions();
        const getWinningStreakByTimeMatch = () => {
            return mainOptions.reduce((result, option) => {
                result[option] = {
                    streak: 0,
                    isStopStreak: false,
                };

                return result;
            }, {});
        };
        this.winStreakCollectorFH = getWinningStreakByTimeMatch();
        this.winStreakCollectorFT = getWinningStreakByTimeMatch();
    }

    getWinningStreakByOptions = ({ options, timeMatch }) => {
        const winStreakCollector = timeMatch === TimeMatch.FH ? this.winStreakCollectorFH : this.winStreakCollectorFT;
        return Math.max(...options.map((option) => winStreakCollector[option]?.streak ?? 0));
    };

    notifyWinStreakByLatestSettlementResultTimeMatch(settlementResult: SettlementResult, timeMatch: TimeMatch) {
        const { notifyWinStreak, gameName } = this.props;
        const mainOptions = this.getMainOptions();

        mainOptions.forEach((option) => {
            const winStreak = timeMatch === TimeMatch.FH ? this.winStreakCollectorFH[option] : this.winStreakCollectorFT[option];

            if (settlementResult[option]) {
                winStreak.streak += 1;

                if (winStreak.streak > 3) {
                    notifyWinStreak({
                        key: uuidv4(),
                        gameName: gameName,
                        choice: option,
                        streak: winStreak.streak,
                        optional: this.getGameTranslate("winStreakText"),
                    });
                }
            } else {
                winStreak.streak = 0;
            }
        });
    }

    renderGameHeader() {
        const { gameState } = this.state,
            kenoGameState = gameState as KenoMatchGameState;

        const gameHeaderProps = {
            isShowCollapse: [
                KenoMatchGameStateEnum.ShowHalfTimeSettlementResult,
                KenoMatchGameStateEnum.ShowFullTimeSettlementResult,
                KenoMatchGameStateEnum.BeforeStartRound,
                KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet,
            ].includes(kenoGameState as KenoMatchGameStateEnum),
            isUpdateDisableRebet: kenoGameState !== KenoMatchGameStateEnum.HalfTimePlacingBet,
            countdownTimerComponent: <KenoCountdownTimer />,
        };

        return <GameHeader {...gameHeaderProps} />;
    }

    renderPopupResult() {
        const { halfTimeResultPopup, fullTimeResultPopup, settlementResult, isActiveLiveFullTime, gameState } = this.state,
            kenoMatchGameState = gameState as KenoMatchGameState;

        return (
            (kenoMatchGameState === KenoMatchGameStateEnum.ShowHalfTimeResult ||
                kenoMatchGameState === KenoMatchGameStateEnum.ShowFullTimeResult) && (
                <BaseDialog type={ModalType.Center}>
                    <PopupResult
                        {...{
                            halfTimeResult: halfTimeResultPopup,
                            fullTimeResult: fullTimeResultPopup,
                            isActiveLiveFullTime,
                            settlementResult,
                            gameName: this.props.gameName.toLocaleLowerCase(),
                        }}
                    />
                </BaseDialog>
            )
        );
    }
}

export default withRouter(withTranslation()(KenoMatch));
