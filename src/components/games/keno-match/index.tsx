import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { io, Socket } from "socket.io-client";

import appSettings from "../../../common/app-settings";
import KenoMatchGameHeader from "../../games/keno-match/header";
import GameBase from "../../shared/game-base";
import DrawResult from "./bet-options";
import Styles from "./game.module.scss";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";

import {
    KenoMatchGameBaseState,
    KenoMatchGameDurations,
    KenoMatchGameState,
    KenoMatchGameStateEnum,
    KenoMatchResult,
    KenoMatchSettlementResult,
    KenoMatchProps
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

class KenoMatch extends GameBase<KenoMatchProps, KenoMatchGameBaseState<KenoMatchResult, KenoMatchSettlementResult>> {
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
            },
        };
    }

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
        const { gameState, roundId, halfTimeResult, fullTimeResult, remainingTime, activeHalfTimeResult } = this.state;
        return (
            <DrawResult
                gameState={gameState}
                halfTimeResult={halfTimeResult}
                fullTimeResult={fullTimeResult}
                isHalfTimeActive={activeHalfTimeResult}
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

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        const { roundId } = this.state;

        return <></>;
    }

    renderResult() {
        const { result } = this.state;
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
        this.messageTransmitter.register("finishHalfTime", this.handleFinishHalfTime.bind(this));
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;
        console.log(`handleRemainingTime gameState : ${gameState}`);
        console.log(`handleRemainingTime remainingTime : ${remainingTime}s`);

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
        console.log(`newGameState ${newGameState}`);
        if (this.state.gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                roundHistory: [],
                activeHalfTimeResult: false,
                ...this.getStateByNextGameState(newGameState),
            };

            this.setState(newState as any);

            // console.log("set new state");
            // console.log(JSON.stringify(newState,null, 2));
        }
    }

    determineGameState(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;
        console.log(JSON.stringify(durations,null, 2));
        console.log(`remainingTime ${remainingTime}`);

        switch (true) {
            case remainingTime <= durations.halfTimePlacingBets && remainingTime > durations.halfTimeLockingBet:
                return KenoMatchGameStateEnum.HalfTime;
            case remainingTime <= durations.halfTimeLockingBet && remainingTime >= durations.showHalfTimeResult:
                return KenoMatchGameStateEnum.HalfTimeLockingBet;
            case remainingTime <= durations.showHalfTimeResult && remainingTime >= durations.showHalfTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowHalfTimeResult;     
            case remainingTime <= durations.showHalfTimeSettlementResult && remainingTime >= durations.beforeStartFullTimePlacingBet:
                return KenoMatchGameStateEnum.ShowFullTimeSettlementResult;   

            case remainingTime <= durations.beforeStartFullTimePlacingBet && remainingTime >= durations.fullTimePlacingBets:
                return KenoMatchGameStateEnum.BeforeStartFullTimePlacingBet;   

            case remainingTime <= durations.fullTimePlacingBets && remainingTime >= durations.fullTimeLockingBet:
                return KenoMatchGameStateEnum.FullTime;   
            case remainingTime <= durations.fullTimeLockingBet && remainingTime >= durations.showFullTimeResult:
                return KenoMatchGameStateEnum.FullTimeLockingBet;  
            case remainingTime <= durations.showFullTimeResult && remainingTime >= durations.showFullTimeSettlementResult:
                return KenoMatchGameStateEnum.ShowFullTimeResult;     
            case remainingTime <= durations.showFullTimeSettlementResult && remainingTime >= 0:
                return KenoMatchGameStateEnum.ShowFullTimeSettlementResult;

            default:
                return GameState.None;
        }
    }

    getStateByNextGameState(nextGameState: KenoMatchGameState) {
        const newStateDetector = [
            {
                condition: nextGameState === KenoMatchGameStateEnum.HalfTime,
                state: {
                    roundId: this.state.roundId + 1,
                    ownBets: {},

                    settlementResult: {},
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
            { remainingTime: this.timeCounter }
        );
    }

    handleRoundHistory({ roundHistory, roundId }) {
        const { gameState } = this.state;
        const kenoMatchGameState = gameState as KenoMatchGameState;

        this.setState({
            roundHistory: roundHistory.slice(0, 40),
            roundId: kenoMatchGameState == KenoMatchGameStateEnum.ShowFullTimeResult ||
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
        const { durations } = this.props;
        const roundHistoryClone = [...roundHistory];

        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            fullTimeResult: finish.result,
            settlementResult: finish.settlementResult,
            roundHistory: roundHistoryClone,
        });

        this.runGame(durations.wholeRound);
    }

    renderGameHeader() {
        return <KenoMatchGameHeader />;
    }
}

export default withRouter(withTranslation()(KenoMatch));
