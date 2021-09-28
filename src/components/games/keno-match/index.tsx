import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { RoundKenoMatchBase } from "../../../types";
import GameBase from "../../shared/game-base";
import { GameState, PopupType, WinStreakCollectorModel } from "../../shared/game-base/type";
import GameHeader from "../../shared/game-header";
import OverlayMaskWhite from "../../shared/overlay-mask-white";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import KenoMatchBetOptions from "./bet-options";
import KenoCountdownTimer from "./countdown-timer";
import Styles from "./game.module.scss";
import { ChoiceForTabActive, Choices, defaultResult, FakeSettlementResult, StatisticRuleMapping } from "./keno-match-helper";
import AnimationResult from "./round-result/animation-result";
import MainFrameResult from "./round-result/main-frame-result";
import HalfRoundSettlement from "./round-result/round-settlement";
import {
    KenoMatchGameBaseState,
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
                halfTimeResultInline: defaultResult,
                fullTimeResultInline: defaultResult,
                isShowBlinkFH: false,
                isShowBlinkFT: false,
                roundHistoryFH: [],
                roundHistoryFT: [],
                isJoiningAtMiddleShowInlineResult: false,
                isFirstHalf: false,
                isShowSettlementResult: false,
                isShowInlineResult: false
            },
        };
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

    renderBetOptions() {
        const { gameState, settlementResult, isFirstHalf, showWinningAnimation, liveOdds } = this.state;

        const betOptionsProps = {
            liveOdds,
            gameState,
            settlementResult: settlementResult ?? FakeSettlementResult,
            isShowWinningEffect: showWinningAnimation,
            isFirstHalf
        };

        const isShowOverlay = [GameState.LockingBet, GameState.DisplayResult].includes(gameState);

        return (
            <div>
                {isShowOverlay && <OverlayMaskWhite />}
                <KenoMatchBetOptions {...betOptionsProps} />
            </div>
        );
    }

    get isShowInlineResult() {
        return true;
    }

    renderResultSection() {
        const { gameName } = this.props;
        const {
            isFirstHalf,
            fullTimeResult,
            halfTimeResult,
            fullTimeResultInline,
            halfTimeResultInline,
            settlementResult,
            isShowSettlementResult,
            showResultInfo,
        } = this.state;

        if (showResultInfo) {
            const result = isFirstHalf ? halfTimeResultInline : fullTimeResultInline;
            const animationResultProps = { isFirstHalf, result };
            return <AnimationResult {...animationResultProps} />;
        }

        if (isShowSettlementResult) {
            return <HalfRoundSettlement {...{ isFirstHalf, gameName: gameName.toLowerCase(), settlementResult }} />;
        }

        return <MainFrameResult {...{ halfTimeResult, fullTimeResult }} />;
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
        const roundHistory = [0, 1, 2].includes(activeScoreboardTab) ? roundHistoryFH : roundHistoryFT;
        const statisticFollowPercentProps = {
            roundHistory,
            activeScoreboardTab,
            statisticRuleEntries: StatisticRuleMapping[activeScoreboardTab],
        };

        return <StatisticFollowPercent {...statisticFollowPercentProps} />;
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

        const dataFollowTabActive = [0, 1, 2].includes(activeScoreboardTab)
            ? { roundHistory: roundHistoryFH, isShowBlink: isShowBlinkFH }
            : { roundHistory: roundHistoryFT, isShowBlink: isShowBlinkFT };

        return (
            <ScoreboardDragon
                roundHistory={dataFollowTabActive.roundHistory}
                dotDetails={{
                    translateDotTextMapping: translateDotTextMapping,
                    choice: ChoiceForTabActive[activeScoreboardTab]?.choice,
                }}
                isShowBlink={dataFollowTabActive.isShowBlink}
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
        const { halfTimeResultInline, fullTimeResultInline, isFirstHalf } = this.state,
            result = isFirstHalf ? halfTimeResultInline : fullTimeResultInline,
            animationResultProps = { isFirstHalf, result, isShowCollapse: true };

        return <AnimationResult {...animationResultProps} />;
    }

    renderSettlementInfo() {
        return <div className={Styles["result-container"]}></div>;
    }

    registerMessageHandler() {
        super.registerMessageHandler();
        this.messageTransmitter.register("firstHalfResult", this.handleFinishHalfTime.bind(this));
        this.messageTransmitter.register("liveOdds", this.handleLiveOdds.bind(this));
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;
        const durations = this.props.durations;

        if (gameState === GameState.None || !this.isUMInFirstLoad) {
            this.runGame(remainingTime);
        }

        const isJoiningAtMiddleShowInlineResult =
            (remainingTime < durations.showHalfTimeResult && remainingTime > durations.beforeStartFullTimePlacingBet) ||
            remainingTime > durations.halfTimePlacingBets;

        this.setState({ isJoiningAtMiddleShowInlineResult });
    }

    handleGamePlay(remainingTime: number) {
        const durations = this.props.durations;
        const { halfTimeResultInline, fullTimeResultInline } = this.state;
        if (durations.resetResult === remainingTime) {
            this.setState({
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultInline: defaultResult,
                fullTimeResultInline: defaultResult,
            });
        }
        
        if (remainingTime === durations.halfTimePlacingBets) {
            this.setState({ roundId: this.state.roundId + 1 });
        }

        this.setState({ isFirstHalf: durations.halfTimePlacingBets >= remainingTime && remainingTime > durations.fullTimePlacingBets });

        this.setState({
            showResultInfo:
                (durations.showFullTimeResult <= remainingTime && remainingTime > durations.showFullTimeSettlementResult) ||
                (durations.showHalfTimeResult >= remainingTime && remainingTime > durations.showHalfTimeSettlementResult),
        });

        const isShowSettlementResult =
            (durations.showFullTimeSettlementResult >= remainingTime && remainingTime > durations.halfTimePlacingBets) ||
            (durations.showHalfTimeSettlementResult >= remainingTime && remainingTime > durations.fullTimePlacingBets);

        if (isShowSettlementResult) {
            this.setState({
                halfTimeResult: halfTimeResultInline,
                fullTimeResult: fullTimeResultInline,
            });
        }

        this.setState({
            isShowSettlementResult,
            showMD5ResultKey: isShowSettlementResult,
        });

        const newGameState = this.determineGameState(remainingTime);

        const gameState = this.state.gameState;

        if (gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                ...this.getStateByNextGameState(newGameState),
            };

            this.setState(newState);
        }
    }

    determineGameState(remainingTime: number) {
        const durations = this.props.durations;

        switch (true) {
            case (durations.wholeRound >= remainingTime && remainingTime > durations.halfTimePlacingBets) ||
                (durations.showHalfTimeResult >= remainingTime && remainingTime > durations.fullTimePlacingBets):
                return GameState.DisplayResult;
            case (durations.halfTimePlacingBets >= remainingTime && remainingTime > durations.halfTimeLockingBet) ||
                (durations.beforeStartFullTimePlacingBet >= remainingTime && remainingTime > durations.fullTimeLockingBet):
                return GameState.InRound;
            case (durations.halfTimeLockingBet >= remainingTime && remainingTime > durations.showHalfTimeResult) ||
                (durations.fullTimeLockingBet >= remainingTime && remainingTime >= 0):
                return GameState.LockingBet;

            default:
                return GameState.None;
        }
    }

    getStateByNextGameState(nextGameState): any {
        const { displayPopup, notice, removeBetChoiceFocus, isFirstHalf } = this.state;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === GameState.InRound) {
            this.betWin = 0;
        }

        if (nextGameState === GameState.LockingBet) {
            removeBetChoiceFocus && removeBetChoiceFocus();
        }

        const newStateDetector = [
            {
                condition: [GameState.BeforeStartRound, GameState.InRound].includes(nextGameState),
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWinningAnimation: false,
                    isShowBlinkFH: false,
                    isShowBlinkFT: false,
                    playResultAnimation: false,
                    showResultInfo: false,
                    isShowSettlementResult: false,
                    betPercentage: {},
                    showMD5ResultKey: false,
                },
            },
            {
                condition: nextGameState === GameState.LockingBet,
                state: {
                    isShowBlinkFH: isFirstHalf,
                    isShowBlinkFT: !isFirstHalf,
                    displayPopup: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : displayPopup,
                    notice: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : notice,
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
        const { gameState, remainingTime } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;
        const roundIdCurrent =
            kenoMatchGameState === KenoMatchGameStateEnum.ShowResult || kenoMatchGameState === KenoMatchGameStateEnum.ShowSettlementResult
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

        const durations = this.props.durations;
        const joinInFirstHalf = durations.halfTimePlacingBets >= remainingTime && remainingTime > durations.resetResult;
        const joinInAfterFinishFulltime = remainingTime > durations.halfTimePlacingBets || remainingTime === 0 ;

        if (joinInFirstHalf || joinInAfterFinishFulltime) {
            this.setState({
                halfTimeResult: roundHistory[0].firstHalf.result,
                fullTimeResult: roundHistory[0].fullTime.result,
                halfTimeResultInline: roundHistory[0].firstHalf.result,
                fullTimeResultInline: roundHistory[0].fullTime.result,
                settlementResult: joinInFirstHalf ? roundHistory[0].firstHalf.settlementResult : roundHistory[0].fullTime.settlementResult,
                md5: joinInFirstHalf ? roundHistory[0].firstHalf.md5 : roundHistory[0].fullTime.md5,
                md5ResultKey: joinInFirstHalf ? roundHistory[0].firstHalf.resultKey : roundHistory[0].fullTime.resultKey,
            });
        }
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

    handleFinishHalfTime({ firstHalfResult }) {
        const { roundHistoryFH, roundId, remainingTime } = this.state;
        const roundHistoryFHClone =
            roundHistoryFH[0]?.roundId !== roundId
                ? this.handleRoundHistoryFH({ firstHalfResult, roundHistoryFH, roundId })
                : roundHistoryFH;

        this.storeOwnBet(roundId);

        this.setState({
            halfTimeResultInline: firstHalfResult.result,
            settlementResult: firstHalfResult.settlementResult,
            playResultAnimation: true,
            md5ResultKey: firstHalfResult.resultKey,
        });

        const durations = this.props.durations;

        if (durations.fullTimePlacingBets > remainingTime) {
            this.setState({
                halfTimeResult: firstHalfResult.result,
            });
        }

        this.showResultInfoH1Timeout = setTimeout(() => {
            this.setState({ roundHistoryFH: roundHistoryFHClone, isShowBlinkFH: false, playResultAnimation: false });
            this.notifyWinStreakByLatestSettlementResultTimeMatch(firstHalfResult.settlementResult, TimeMatch.FH);
        }, durations.showHalfTimeResult - durations.showHalfTimeSettlementResult);
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
        const newState = {
            fullTimeResultInline: finish.result,
            settlementResult: finish.settlementResult,
            playResultAnimation: true,
            md5ResultKey: finish.resultKey,
        };

        this.setState(newState as any);

        const animationDuration = this.getFinishAnimationDuration();

        this.showResultInfoTimeout = setTimeout(() => {
            this.setState({
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

    handleStatus = ({ status }) => {
        const { win, bet } = status;
        const durations = this.props.durations;

        if (win) {
            setTimeout(() => {
                this.betWin = bet;
            }, durations.settlementWinning * 1000);
        }
    };

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
        const { gameState, isFirstHalf } = this.state;

        const gameHeaderProps = {
            isShowCollapse: [GameState.DisplayResult, GameState.BeforeStartRound].includes(gameState),
            isUpdateDisableRebet: gameState !== GameState.InRound,
            countdownTimerComponent: <KenoCountdownTimer isFistHalf={isFirstHalf} />,
        };

        return <GameHeader {...gameHeaderProps} />;
    }
}

export default withRouter(withTranslation()(KenoMatch));
