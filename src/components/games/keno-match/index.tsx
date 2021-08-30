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
import { DrawFullResult, DrawHalfResult } from "./round-result";
 import {choicesMapper, defaultResult} from "./keno-match-helper";
import {
    KenoMatchGameBaseState,
    KenoMatchGameDurations,
    KenoMatchGameState,
    KenoMatchGameStateEnum,
    KenoMatchProps,
    Result,
    SettlementResult,
} from "./type";

class KenoMatch extends GameBase<KenoMatchProps, KenoMatchGameBaseState<Result, SettlementResult>> {
    private socket: Socket;

    constructor(props: KenoMatchProps) {
        super(props);

        this.state = {
            ...this.defaultState,
            ...{
                // kenoMatchGameState: GameState.None,
                roundHistory: [],
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultPopup: defaultResult,
                fullTimeResultPopup: defaultResult,
                activeHalfTimeResult: false,
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
            roundId,
            halfTimeResult,
            fullTimeResult,
            remainingTime,
            activeHalfTimeResult,
            showWinningAnimation,
        } = this.state;

        const fakeSettlementResult = {
            blue: false,
            red: false,
            over: true,
            under: false,
            odd: true,
            even: false,
        };
        return (
            <KenoMatchBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
                activeHalfTimeResult={activeHalfTimeResult}
            />
        );
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return <></>;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        const { gameState, halfTimeResult, fullTimeResult, activeHalfTimeResult } = this.state;
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
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;

        if (gameState === GameState.None || !this.isUMInFirstLoad) {
            this.runGame(remainingTime);
        }
    }

    handleGamePlay(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;
        const activeHalfTimeResult = remainingTime <= durations.resetResult && remainingTime >= 0;

        if (this.state.activeHalfTimeResult !== activeHalfTimeResult) {
            this.setState({ activeHalfTimeResult });
        }

        if (remainingTime === durations.resetResult) {
            this.setState({
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                halfTimeResultPopup: defaultResult,
                fullTimeResultPopup: defaultResult,
            });
        }

        // console.log(`--------------`);
        // console.log(`remainingTime ${remainingTime}`);
        const newGameState = this.determineGameState(remainingTime);
        // console.log(`newGameState ${newGameState}`);

        const gameState = this.state.gameState as KenoMatchGameState;

        if (gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                roundHistory: [],
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
        const { roundId, displayPopup, notice, fullTimeResultPopup, halfTimeResultPopup } = this.state;
        const { durations } = this.props;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet || nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet) {
            this.betWin = 0;
        }

        const newStateDetector = [
            {
                condition: [KenoMatchGameStateEnum.HalfTimePlacingBet, KenoMatchGameStateEnum.FullTimePlacingBet].includes(nextGameState),
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWinningAnimation: false,
                    isShowBlink: false,
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
                condition:
                    nextGameState === KenoMatchGameStateEnum.ShowHalfTimeSettlementResult ||
                    nextGameState === KenoMatchGameStateEnum.ShowFullTimeSettlementResult,
                state: {
                    halfTimeResult: halfTimeResultPopup,
                    fullTimeResult: fullTimeResultPopup
                },
            },
            {
                condition:
                    nextGameState === KenoMatchGameStateEnum.FullTimeLockingBet ||
                    nextGameState === KenoMatchGameStateEnum.HalfTimeLockingBet,
                state: {
                    isShowBlink: true,
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

    handleRoundHistory({ roundHistory, roundId }) {
        const { gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;

        this.setState({
            roundHistory: roundHistory,
            roundId:
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeSettlementResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeSettlementResult
                    ? roundId - 1
                    : roundId,
        });
    }

    handleFinishHalfTime({ firstHalfResult }) {
        this.setState({
            halfTimeResultPopup: firstHalfResult.result,
            settlementResult: firstHalfResult.settlementResult,
            activeHalfTimeResult: true,
        });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const roundHistoryClone = [...roundHistory];

        this.isProcessingBet = false;
        this.clearRetryInterval();
        this.storeOwnBet(finish.roundId);
        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            fullTimeResultPopup: finish.result,
            settlementResult: finish.settlementResult,
            activeHalfTimeResult: false,
            roundHistory: roundHistoryClone,
        });

        const animationDuration = this.getFinishAnimationDuration();

        this.showResultInfoTimeout = setTimeout(() => {
            this.setState({ showResultInfo: true, isShowBlink: false, roundHistory: roundHistoryClone, playResultAnimation: false });
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
        const { halfTimeResultPopup, fullTimeResultPopup, activeHalfTimeResult, gameState } = this.state,
            kenoMatchGameState = gameState as KenoMatchGameState;

        return (
            (kenoMatchGameState === KenoMatchGameStateEnum.ShowHalfTimeResult ||
                kenoMatchGameState === KenoMatchGameStateEnum.ShowFullTimeResult) && (
                <BaseDialog type={ModalType.Center}>
                    <DrawHalfResult
                        {...{
                            halfTimeResult: halfTimeResultPopup,
                            fullTimeResult: fullTimeResultPopup,
                            activeHalfTimeResult,
                            gameName: this.props.gameName,
                        }}
                    />
                </BaseDialog>
            )
        );
    }

    renderRoundResult() {
        const { halfTimeResult, fullTimeResult, activeHalfTimeResult } = this.state;

        return <DrawFullResult {...{ halfTimeResult, fullTimeResult, activeHalfTimeResult, gameName: this.props.gameName }} />;
    }
}

export default withRouter(withTranslation()(KenoMatch));
