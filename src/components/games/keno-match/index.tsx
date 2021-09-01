import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { io, Socket } from "socket.io-client";

import appSettings from "../../../common/app-settings";
import KenoMatchGameHeader from "../../games/keno-match/header";
import BaseDialog from "../../shared/base-dialog";
import { ModalType } from "../../shared/base-dialog/type";
import GameBase from "../../shared/game-base";
import { Boundary, GameState, PopupType, Position } from "../../shared/game-base/type";
import KenoMatchBetOptions from "./bet-options";
import Styles from "./game.module.scss";
import { DrawFullResult, PopupResult } from "./round-result";
 import {choicesMapper, defaultResult} from "./keno-match-helper";
import {
    KenoMatchGameBaseState,
    KenoMatchGameDurations,
    KenoMatchGameState,
    KenoMatchGameStateEnum,
    KenoMatchProps,
    Result,
    SettlementResult,
    KenoMatchRound,
    SeparateRoundHistoryProps,
} from "./type";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { ScoreboardRule } from "./scoreboard-round-history";
import { Choices, StatisticRuleMapping } from "./keno-match-helper";
import { RoundKenoMatchBase } from "../../../types";

class KenoMatch extends GameBase<KenoMatchProps, KenoMatchGameBaseState<Result, SettlementResult>> {
    private socket: Socket;
    private settlementResultOrg: SettlementResult;
    protected showResultInfoH1Timeout: NodeJS.Timeout;
    private isResetResult = false;

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
                isShowBlinkH1: false,
                isShowBlinkFH: false,
                roundHistoryH1: [],
                roundHistoryFH: [],
            },
        };
    }

    componentDidUpdate(prevProps) {}

    onStart() {
        this.isProcessingBet = false;
        const { socketInfo } = this.props;
        const { session } = this.context;
        const { proxy } = appSettings;
        const socketUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri}/user/${socketInfo.namespace}`;

        this.initWinStreakCollector();
        this.socket = io(socketUri, {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: `${proxy.path}/${socketInfo.path}/socket.io`,
        });
        this.socket.on("connect", () => {
            this.socket.emit("signin", session);
        });
        this.socket.on("signedIn", () => {
            this.setState({ signedIn: true });
            this.socket.emit("inGame");
        });
        this.socket.on(this.props.gameName, this.messageTransmitter.broadcast.bind(this));
        this.socket.on("connect_error", this.onConnectFailed.bind(this));
        this.socket.on("message", this.onMessageUserStakeLevel.bind(this));
        this.socket.on("disconnect", () => {
            this.setState({ gameState: GameState.None });
        });
    }

    onDestroy() {
        super.onDestroy();
        this.showResultInfoH1Timeout && clearTimeout(this.showResultInfoH1Timeout);
        this.socket && this.socket.disconnect();
    }

    retryConnect = () => {
        this.onStart();
    };

    getMainOptions(): string[] {
        return Object.keys(choicesMapper);
    }

    renderBetOptions() {
        const {
            gameState,
            settlementResult,
            isActiveLiveFullTime,
            showWinningAnimation,
            liveOdds
        } = this.state;

        const fakeSettlementResult = {
            blue: false,
            red: false,
            tie: true,
            over: true,
            under: false,
            odd: true,
            even: false,
        };
        
        const betOptionsProps = {
            liveOdds,
            gameState,
            settlementResult: settlementResult ?? fakeSettlementResult,
            isShowWinningEffect: showWinningAnimation,
            isActiveLiveFullTime: isActiveLiveFullTime
        };

        return (
            <KenoMatchBetOptions {...betOptionsProps}/>
        );
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            firstHalfBlueRed: {
                tabName: this.getGameTranslate("firstHalfBlueRed"),
                tabWinningStreak: this.getWinningStreakByOptions(["blue", "red", "tie"]),
            },
            firstHalfOverUnder: {
                tabName: this.getGameTranslate("firstHalfOverUnder"),
                tabWinningStreak: this.getWinningStreakByOptions(["over", "under"]),
            },
            firstHalfEvenOdd: {
                tabName: this.getGameTranslate("firstHalfEvenOdd"),
                tabWinningStreak: this.getWinningStreakByOptions(["even", "odd"]),
            },
            fullTimeBlueRed: {
                tabName: this.getGameTranslate("fullTimeBlueRed"),
                tabWinningStreak: this.getWinningStreakByOptions(["blue", "red", "tie"]),
            },
            fullTimeOverUnder: {
                tabName: this.getGameTranslate("fullTimeOverUnder"),
                tabWinningStreak: this.getWinningStreakByOptions(["over", "under"]),
            },
            fullTimeEvenOdd: {
                tabName: this.getGameTranslate("fullTimeEvenOdd"),
                tabWinningStreak: this.getWinningStreakByOptions(["even", "odd"]),
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
        const { activeScoreboardTab, roundHistoryH1, roundHistoryFH } = this.state;
        const getRoundHistory = () => {
            switch (activeScoreboardTab) {
                case 0:
                case 1:
                case 2:
                    return roundHistoryH1;
                case 3:
                case 4:
                case 5:
                    return roundHistoryFH;
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
        const { activeScoreboardTab, isShowBlinkH1, isShowBlinkFH, roundHistoryH1, roundHistoryFH } = this.state;
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
                    return { roundHistory: roundHistoryH1, isShowBlink: isShowBlinkH1 };
                case 3:
                case 4:
                case 5:
                    return { roundHistory: roundHistoryFH, isShowBlink: isShowBlinkFH };
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
        const { durations } = this.props;
        const { gameState, halfTimeResult, fullTimeResult, isActiveLiveFullTime } = this.state;
        return <></>;
    }

    renderResult() {
        return <></>;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <></>;
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

        if (gameState === GameState.None || !this.isUMInFirstLoad) {
            this.runGame(remainingTime);
        }
    }

    handleGamePlay(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;

        if (remainingTime > durations.showHalfTimeResult && remainingTime <= durations.resetResult) {
            this.setState({
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultPopup: defaultResult,
                fullTimeResultPopup: defaultResult,
            });
            this.isResetResult = true;
        }
        const newGameState = this.determineGameState(remainingTime);

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
            case KenoMatchGameStateEnum.HalfTimePlacingBet:
            case KenoMatchGameStateEnum.FullTimePlacingBet:
            case KenoMatchGameStateEnum.FullTimeLockingBet:
                return remainingTime;
            default:
                return 0;
        }
    }

    getStateByNextGameState(nextGameState: KenoMatchGameStateEnum): any {
        const { roundId, displayPopup, notice, fullTimeResultPopup, halfTimeResultPopup, settlementResult } = this.state;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet || nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet) {
            this.betWin = 0;
            this.isResetResult = false;
        }

        const newStateDetector = [
            {
                condition: [
                    KenoMatchGameStateEnum.BeforeStartRound,
                    KenoMatchGameStateEnum.HalfTimePlacingBet,
                    KenoMatchGameStateEnum.FullTimePlacingBet,
                    KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet,
                ].includes(nextGameState),
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWinningAnimation: false,
                    isShowBlinkH1: false,
                    isShowBlinkFH: false,
                    playResultAnimation: false,
                    showResultInfo: false,
                    betPercentage: {},
                },
            },
            {
                condition: [
                    KenoMatchGameStateEnum.BeforeStartRound,
                    KenoMatchGameStateEnum.ShowHalfTimeResult,
                    KenoMatchGameStateEnum.ShowHalfTimeSettlementResult,
                    KenoMatchGameStateEnum.FullTimePlacingBet,
                ].includes(nextGameState),
                state: {
                    fullTimeResult: defaultResult,
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
                    settlementResult: this.settlementResultOrg,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.ShowFullTimeSettlementResult,
                state: {
                    fullTimeResult: fullTimeResultPopup,
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
                    isShowBlinkH1: true,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.FullTimeLockingBet,
                state: {
                    isShowBlinkFH: true,
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

    placeBet(betChoice: string, amount: number, betPosition?: Position, betOptionBoundary?: Boundary) {
        const { displayPopup } = this.state;

        if (this.isProcessingBet && displayPopup !== PopupType.Rebet) {
            this.setState({ notice: { message: this.props.t("messages:betProcessing"), duration: 2 } });
        } else {
            if (amount > 0) {
                this.betPosition = betPosition;
                this.betOptionBoundary = betOptionBoundary;
                this.isProcessingBet = true;
                this.setRetryInterval();
                this.socket.emit("bet", { betChoice, amount });
            }
        }
    }

    handleRoundHistory({ roundHistory, roundId, firstHalfResult }) {
        const { gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;
        const rounds: SeparateRoundHistoryProps = this.separateRoundHistory(roundHistory);

        const sourceState = {
            roundHistory: roundHistory,
            roundId:
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeSettlementResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeSettlementResult
                    ? roundId - 1
                    : roundId,
            roundHistoryH1: rounds.roundHistoryH1,
            roundHistoryFH: rounds.roundHistoryFH,
            halfTimeResult:
                kenoMatchGameState === KenoMatchGameStateEnum.FullTimePlacingBet
                    ? firstHalfResult?.result
                    : roundHistory[0]?.firstHalf?.result,
        };

        if (kenoMatchGameState === KenoMatchGameStateEnum.HalfTimePlacingBet && !this.isResetResult) {
            Object.assign(sourceState, { fullTimeResult: roundHistory[0]?.fullTime?.result });
        }

        this.setState(sourceState);
    }

    separateRoundHistory = (roundHistory: KenoMatchRound<Result, SettlementResult>[]) => {
        const rounds = {
            roundHistoryH1: [],
            roundHistoryFH: [],
        };

        roundHistory.forEach((round) => {
            rounds.roundHistoryH1.push({ ...round.firstHalf, roundId: round.roundId, odds: round.odds });
            rounds.roundHistoryFH.push({ ...round.fullTime, roundId: round.roundId, odds: round.odds });
        });

        return rounds;
    };

    handleFinishHalfTime({ firstHalfResult }) {
        const { roundHistoryH1, roundId } = this.state;
        const roundHistoryH1Clone = [...roundHistoryH1];
        roundHistoryH1Clone.unshift({ ...firstHalfResult, roundId: roundId } as RoundKenoMatchBase<Result, SettlementResult>);
        roundHistoryH1Clone.length > 100 && roundHistoryH1Clone.pop();

        this.settlementResultOrg = firstHalfResult.settlementResult;
        this.setState({
            halfTimeResultPopup: firstHalfResult?.result,
        });
        const animationDuration = this.getFinishAnimationDuration();
        this.showResultInfoH1Timeout = setTimeout(() => {
            this.setState({ roundHistoryH1: roundHistoryH1Clone, isShowBlinkH1: false });
        }, animationDuration);
    }

    handleLiveOdds({ liveOdds }) {
        this.setState({ liveOdds });
    }

    handleFinish({ finish }) {
        const { roundHistoryFH } = this.state;
        const roundHistoryFHClone = [...roundHistoryFH];

        this.isProcessingBet = false;
        this.clearRetryInterval();
        this.storeOwnBet(finish.roundId);
        roundHistoryFHClone.unshift(finish);
        roundHistoryFHClone.length > 100 && roundHistoryFHClone.pop();

        this.settlementResultOrg = finish.settlementResult;
        this.setState({
            fullTimeResultPopup: finish.result,
            liveOdds:null
        });

        const animationDuration = this.getFinishAnimationDuration();

        this.showResultInfoTimeout = setTimeout(() => {
            this.setState({ showResultInfo: true, isShowBlinkFH: false, roundHistoryFH: roundHistoryFHClone, playResultAnimation: false });
            this.notifyWinStreakByLatestSettlementResult(finish.settlementResult);
        }, animationDuration);

        this.showWinningAnimationTimeout = setTimeout(() => {
            this.setState({
                showWinningAnimation: true,
            });
        }, this.winningAnimationWaitingTimeInSecond);
    }

    renderGameHeader() {
        return <KenoMatchGameHeader />;
    }

    renderPopupResult() {
        const { halfTimeResultPopup, fullTimeResultPopup, isActiveLiveFullTime, gameState } = this.state,
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
                            gameName: this.props.gameName,
                        }}
                    />
                </BaseDialog>
            )
        );
    }

    renderRoundResult() {
        const { halfTimeResult, fullTimeResult, isActiveLiveFullTime } = this.state;

        return <DrawFullResult {...{ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName: this.props.gameName }} />;
    }
}

export default withRouter(withTranslation()(KenoMatch));
