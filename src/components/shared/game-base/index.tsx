import React from "react";
import io from "socket.io-client";

import * as LocalStorageManager from "../../../common/local-storage";
import { AuthContext } from "../../../contexts/auth";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import GameContainer from "../../shared/game-container";
import BetContainer from "../bet-container";
import Styles from "./game-base.module.scss";
import { GameBaseProps, GameBaseState, GameConfigs, GameState, RebetStorageModel, PopupType } from "./type";
import MessageTransmitter from "./message-transmitter";
import { MessageTransmitterType } from "./message-transmitter/type";

abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.Component<P, S> {
    protected socket: SocketIOClient.Socket;
    protected interval: NodeJS.Timeout;
    protected timeCounter: number;
    protected reBetStorageKey: string;
    protected betSettingStorageKey: string;
    protected messageTransmitter: MessageTransmitterType;

    constructor(props: P) {
        super(props);

        this.reBetStorageKey = LocalStorageManager.localStorageKeys.rebet;
        this.betSettingStorageKey = LocalStorageManager.localStorageKeys.betSetting;
        this.messageTransmitter = MessageTransmitter();
        this.registerMessageHandler();
        this.placeBet = this.placeBet.bind(this);
        this.getBetHistory = this.getBetHistory.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.updateStatePopup = this.updateStatePopup.bind(this);
    }

    componentDidMount() {
        const { socketInfo } = this.props;
        const { session } = this.context;

        this.socket = io(socketInfo.uri, {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: socketInfo.proxyRoute,
        });
        this.socket.on("connect", () => {
            this.socket.emit("signin", session);
        });
        this.socket.on("signedIn", () => {
            this.socket.emit("inGame");
        });

        this.socket.on(this.props.gameName, this.messageTransmitter.broadcast.bind(this));
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        this.messageTransmitter.clearAllListener();
        this.socket.disconnect();
    }

    registerMessageHandler = () => {
        this.messageTransmitter.addListener("um", this.handleUM.bind(this));
        this.messageTransmitter.addListener("remainingTime", this.handleRemainingTime.bind(this));
        this.messageTransmitter.addListener("gameConfigs", this.handleGameConfigs.bind(this));
        this.messageTransmitter.addListener("roundHistory", this.handleRoundHistory.bind(this));
        this.messageTransmitter.addListener("finish", this.handleFinish.bind(this));
        this.messageTransmitter.addListener("history", this.handleHistory.bind(this));
        this.messageTransmitter.addListener("user", this.handleUserData.bind(this));
        this.messageTransmitter.addListener("totalBets", this.handleTotalBet.bind(this));
        this.messageTransmitter.addListener("ownBets", this.handleOwnBets.bind(this));
    };

    handleTotalBet = ({ totalBets }) => {
        this.setState({ totalBets });
    };

    handleOwnBets = ({ ownBets }) => {
        this.setState({ ownBets });
    };

    handleUserData({ user }) {
        this.context.setBalance(user.red);
    }

    handleUM({ isUm }) {
        if (isUm) {
            this.setState({ gameState: GameState.Disabled });
        }
    }

    handleRemainingTime({ remainingTime }) {
        this.timeCounter = remainingTime;

        this.interval && clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.timeCounter > 0 && this.timeCounter--;

            this.handleGamePlay(this.timeCounter);
        }, 1000);

        this.handleGamePlay(remainingTime);
    }

    handleGamePlay(remainingTime: number) {
        const { roundId, gameState } = this.state;
        const newGameState = this.determineGameState(remainingTime);

        if (newGameState === GameState.BeforeStartRound) {
            this.setState({
                ownBets: {},
                totalBets: {},
            });
        }

        const timeCounter = this.getTimeCounter(this.timeCounter, newGameState);
        const newRoundId = gameState !== GameState.InRound && newGameState === GameState.InRound ? roundId + 1 : roundId;

        const newState = {
            remainingTime: timeCounter,
            gameState: newGameState,
            roundId: newRoundId,
        };

        this.setState(newState);
    }

    handleGameConfigs({ gameConfigs }) {
        this.setState({ gameConfigs, signedIn: true });
    }

    determineGameState(remainingTime: number) {
        const { durations } = this.props;

        if (remainingTime >= durations.wholeRound - durations.showResult) {
            return GameState.DisplayResult;
        }

        if (remainingTime > durations.placingBets + (durations.beforeStartRound ?? 0)) {
            return GameState.Waiting;
        }

        if (durations.beforeStartRound && remainingTime > durations.placingBets) {
            return GameState.BeforeStartRound;
        }

        if (remainingTime <= durations.placingBets && remainingTime > durations.lockingBet) {
            return GameState.InRound;
        }

        if (remainingTime <= durations.lockingBet && remainingTime >= 0) {
            return GameState.LockingBet;
        }

        return GameState.None;
    }

    getTimeCounter(remainingTime: number, gameState: GameState) {
        const { durations } = this.props;

        switch (gameState) {
            case GameState.Waiting:
                return remainingTime - (durations.placingBets + (durations.beforeStartRound ?? 0));
            case GameState.InRound:
            case GameState.LockingBet:
                return remainingTime;
            default:
                return 0;
        }
    }

    handleRoundHistory({ roundHistory }) {
        const { gameState } = this.state;
        const lastRoundId = roundHistory[0] ? roundHistory[0].roundId : 0;
        this.setState({
            roundHistory,
            roundId: gameState === GameState.InRound ? lastRoundId + 1 : lastRoundId,
            result: roundHistory[0]?.result,
            settlementResult: roundHistory[0]?.settlementResult,
        });
    }

    handleHistory({ betHistory }) {
        this.setState({ betHistory });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;

        this.storeOwnBet(finish.roundId);

        roundHistory.unshift(finish);
        roundHistory.pop();
        this.setState({
            roundHistory,
            result: finish.result,
            settlementResult: finish.settlementResult,
        });
    }

    storeOwnBet(roundId: number) {
        const { ownBets } = this.state;
        const gameId = this.props.id;
        const rebetStorage = LocalStorageManager.getLocalStorageItem<RebetStorageModel>(this.reBetStorageKey) || {};

        rebetStorage[gameId] = {
            roundId,
            betInfo: Object.keys(ownBets).length > 0 ? ownBets : undefined,
        };

        LocalStorageManager.storeLocalStorageItem(this.reBetStorageKey, rebetStorage);
    }

    placeBet(betChoice: string, amount: number) {
        this.socket.emit("bet", { betChoice, amount });
    }

    async getBetHistory(page = 1) {
        this.socket.emit("getHistory", { page: page });
    }

    updateGameState(gameState: GameState) {
        this.setState({ gameState });
    }

    updateStatePopup(popupType: PopupType) {
        this.setState({ displayPopup: popupType });
    }

    abstract renderBetOptions(): React.ReactElement;

    abstract renderRoundHistory(): React.ReactElement;

    abstract renderStatistic(): React.ReactElement;

    abstract renderBoard(): React.ReactElement;

    abstract renderResult(): React.ReactElement;

    abstract renderGuide(): JSX.Element;

    abstract renderBetHistory(): React.ReactElement;

    abstract renderReBet(): React.ReactElement;

    renderStartRoundAnimation() {
        return <></>;
    }

    renderPopup(popupType: PopupType) {
        switch (popupType) {
            case PopupType.Guide:
                return this.renderGuide();
            case PopupType.Rebet:
                return this.renderReBet();
            case PopupType.BetHistory:
                return this.renderBetHistory();
            default:
                return null;
        }
    }

    closePopup() {
        this.setState({ displayPopup: null });
    }

    get isDisplayResult() {
        return this.state.gameState == GameState.DisplayResult;
    }

    get isShowStartRoundAnimation() {
        return false;
    }

    render() {
        const { gameName, id, socketInfo } = this.props;
        const { remainingTime, roundId, gameState, signedIn, totalBets, ownBets, gameConfigs, betHistory, displayPopup } = this.state;

        const gameContext = {
            placeBet: this.placeBet,
            updateGameState: this.updateGameState,
            totalBets,
            ownBets,
            gameName,
            roundId,
            gameConfigs,
            getBetHistory: this.getBetHistory,
            betHistory,
            updateStatePopup: this.updateStatePopup,
            handleMessage: this.messageTransmitter.addListener,
        };

        return signedIn ? (
            <GameContextProvider value={gameContext}>
                <GameContainer
                    gameId={id}
                    gameName={gameName}
                    remainingTime={remainingTime}
                    roundId={roundId}
                    gameState={gameState}
                    apiUrl={socketInfo.api}
                >
                    <BetContainer gameState={gameState}>
                        <div className={Styles["bet-options"]}>{this.renderBetOptions()}</div>
                        {this.isShowStartRoundAnimation && this.renderStartRoundAnimation()}
                        {this.isDisplayResult && this.renderResult()}
                    </BetContainer>
                    <div className={Styles["mini-round-history"]}>{this.renderRoundHistory()}</div>
                    <div className={Styles["statistic"]}>{this.renderStatistic()}</div>
                    <div className={Styles["board"]}>{this.renderBoard()}</div>
                    {this.renderPopup(displayPopup)}
                </GameContainer>
            </GameContextProvider>
        ) : (
            <div>Loading...</div>
        );
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
