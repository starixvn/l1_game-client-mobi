import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { io, Socket } from "socket.io-client";

import appSettings from "../../../common/app-settings";
import KenoMatchGameHeader from "../../games/keno-match/header";
import BaseDialog from "../../shared/base-dialog";
import { ModalType } from "../../shared/base-dialog/type";
import GameBase from "../../shared/game-base";
import { GameState, PopupType } from "../../shared/game-base/type";
import KenoMatchBetOptions from "./bet-options";
import Styles from "./game.module.scss";
import { DrawFullResult, DrawHalfResult } from "./round-result";
import {
    KenoMatchGameBaseState,
    KenoMatchGameDurations,
    KenoMatchGameState,
    KenoMatchGameStateEnum,
    KenoMatchProps,
    Result,
    SettlementResult,
} from "./type";

export const choicesMapper = {
    fhBlue: 1,
    fhRed: 2,
    fhOver: 3,
    fhUnder: 4,
    fhEven: 5,
    fhOdd: 6,
    ftBlue: 7,
    ftRed: 8,
    ftOver: 9,
    ftUnder: 10,
    ftEven: 11,
    ftOdd: 12,
    liveFTBlue: 13,
    liveFTRed: 14,
    liveFTOver: 15,
    liveFTUnder: 16,
    liveFTOdd: 17,
    liveFTEven: 18,
};

const defaultResult = {
    blue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    red: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

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
                activeHalfTimeResult: false,
                showPopup: false,
            },
        };
    }

    componentDidUpdate(prevProps) {}

    onStart() {
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

    renderPopupResult() {
        const { gameState, halfTimeResult, fullTimeResult, activeHalfTimeResult } = this.state;

        return (
            <BaseDialog type={ModalType.Center} isOpen={true}>
                <DrawHalfResult {...{ gameState, halfTimeResult, fullTimeResult, activeHalfTimeResult }} />
            </BaseDialog>
        );
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
        this.messageTransmitter.register("finishHalfTime", this.handleFinishHalfTime.bind(this));
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
            this.setState({ halfTimeResult: defaultResult, fullTimeResult: defaultResult });
        }

        const newGameState = this.determineGameState(remainingTime);
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
        // console.log(JSON.stringify(durations,null, 2));
        // console.log(`remainingTime ${remainingTime}`);

        switch (true) {
            case remainingTime <= durations.halfTimePlacingBets && remainingTime > durations.halfTimeLockingBet:
                return KenoMatchGameStateEnum.HalfTimePlacingBet;
            case remainingTime > durations.showHalfTimeResult:
                return KenoMatchGameStateEnum.HalfTimeLockingBet;
            case remainingTime > durations.showHalfTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowHalfTimeResult;
            case remainingTime > durations.beforeStartFullTimePlacingBet:
                return KenoMatchGameStateEnum.ShowFullTimeSettlementResult;

            case remainingTime > durations.fullTimePlacingBets:
                return KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet;

            case remainingTime > durations.fullTimeLockingBet:
                return KenoMatchGameStateEnum.FullTimePlacingBet;
            case remainingTime > durations.showFullTimeResult:
                return KenoMatchGameStateEnum.FullTimeLockingBet;
            case remainingTime > durations.showFullTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowFullTimeResult;
            case remainingTime > 0:
                return KenoMatchGameStateEnum.ShowFullTimeSettlementResult;

            default:
                return KenoMatchGameStateEnum.None;
        }
    }

    getTimeCounter(remainingTime: number, gameState: KenoMatchGameState) {
        const { durations } = this.props;

        switch (gameState) {
            case KenoMatchGameStateEnum.HalfTimePlacingBet:
            case KenoMatchGameStateEnum.HalfTimeLockingBet:
            case KenoMatchGameStateEnum.HalfTimePlacingBet:
            case KenoMatchGameStateEnum.FullTimePlacingBet:
            case KenoMatchGameStateEnum.FullTimeLockingBet:
                return remainingTime;
            case KenoMatchGameStateEnum.BeforeStartRound:
                return durations.beforeStartRound;
            default:
                return 0;
        }
    }

    getStateByNextGameState(nextGameState: KenoMatchGameStateEnum): any {
        const { roundId, displayPopup, notice } = this.state;
        const { durations } = this.props;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet || nextGameState === KenoMatchGameStateEnum.HalfTimePlacingBet) {
            this.betWin = 0;
        }

        const newStateDetector = [
            {
                condition: [
                    KenoMatchGameStateEnum.BeforeStartRound,
                    // KenoMatchGameStateEnum.HalfTimePlacingBet,
                    KenoMatchGameStateEnum.FullTimePlacingBet,
                ].includes(nextGameState),
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
                condition: durations.beforeStartRound
                    ? nextGameState === KenoMatchGameStateEnum.BeforeStartRound
                    : nextGameState === KenoMatchGameStateEnum.FullTimePlacingBet,
                state: {
                    roundId: roundId + 1,
                },
            },
            {
                condition: nextGameState === KenoMatchGameStateEnum.FullTimeLockingBet, // || nextGameState === KenoMatchGameStateEnum.HalfTimeLockingBet,
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

    handleRoundHistory({ roundHistory, roundId }) {
        const { gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;

        this.setState({
            roundHistory: roundHistory.slice(0, 40),
            roundId:
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeSettlementResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeResult ||
                kenoMatchGameState == KenoMatchGameStateEnum.ShowHalfTimeSettlementResult
                    ? roundId - 1
                    : roundId,
        });
    }

    handleFinishHalfTime({ finishHalfTime }) {
        this.setState({
            halfTimeResult: finishHalfTime.result,
            settlementResult: finishHalfTime.settlementResult,
        });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const roundHistoryClone = [...roundHistory];

        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            fullTimeResult: finish.result,
            settlementResult: finish.settlementResult,
            roundHistory: roundHistoryClone,
        });
    }

    renderGameHeader() {
        return <KenoMatchGameHeader />;
    }

    renderRoundResult() {
        const { gameState, halfTimeResult, fullTimeResult, activeHalfTimeResult } = this.state;

        return <DrawFullResult {...{ gameState, halfTimeResult, fullTimeResult, activeHalfTimeResult }} />;
    }
}

export default withRouter(withTranslation()(KenoMatch));
