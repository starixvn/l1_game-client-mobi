import React from "react";
import io from "socket.io-client";

import * as LocalStorageManager from "../../../common/local-storage";
import { AuthContext } from "../../../contexts/auth";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import GameContainer from "../../shared/game-container";
import { GameBaseProps, GameBaseState, GameConfigs, GameState, RebetStorageModel } from "./type";

abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.Component<P, S> {
    protected socket: SocketIOClient.Socket;
    protected interval: NodeJS.Timeout;
    protected timeCounter: number;
    protected reBetStorageKey: string;
    protected betSettingStorageKey: string;

    constructor(props: P) {
        super(props);

        this.reBetStorageKey = LocalStorageManager.localStorageKeys.rebet;
        this.betSettingStorageKey = LocalStorageManager.localStorageKeys.betSetting;

        this.placeBet = this.placeBet.bind(this);
        this.getBetHistory = this.getBetHistory.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
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

        this.socket.on(this.props.gameName, this.handleEvent.bind(this));
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        this.socket.disconnect();
    }

    handleEvent(payload: any) {
        if (payload.um) {
            this.handleUM(payload.um);
        }
        if (payload.remainingTime) {
            this.handleRemainingTime(payload.remainingTime);
        }
        if (payload.gameConfigs) {
            this.handleGameConfigs(payload.gameConfigs);
        }
        if (payload.roundHistory) {
            this.handleRoundHistory(payload.roundHistory);
        }
        if (payload.finish) {
            this.handleFinish(payload.finish);
        }
        if (payload.totalBets) {
            this.setState({ totalBets: payload.totalBets });
        }
        if (payload.ownBets) {
            this.setState({ ownBets: payload.ownBets });
        }
        if (payload.history) {
            this.handleHistory(payload.history);
        }
        if (payload.user) {
            this.handleUserData(payload.user);
        }
    }

    handleUserData(user) {
        this.context.setBalance(user.red);
    }

    handleUM(isUM: boolean) {
        if (isUM) {
            this.setState({ gameState: GameState.Disabled });
        }
    }

    handleRemainingTime(remainingTime: number) {
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

    handleGameConfigs(gameConfigs: GameConfigs) {
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

    handleRoundHistory(roundHistory) {
        const { gameState } = this.state;
        const lastRoundId = roundHistory[0] ? roundHistory[0].roundId : 0;
        this.setState({
            roundHistory,
            roundId: gameState === GameState.InRound ? lastRoundId + 1 : lastRoundId,
            result: roundHistory[0]?.result,
            settlementResult: roundHistory[0]?.settlementResult,
        });
    }

    handleHistory(betHistory) {
        this.setState({ betHistory });
    }

    handleFinish(finish) {
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

    abstract renderGame(): React.ReactElement;

    render() {
        const { gameName, id, socketInfo } = this.props;
        const {
            remainingTime,
            roundId,
            gameState,
            signedIn,
            totalBets,
            ownBets,
            gameConfigs,
            betHistory,
            result,
            settlementResult,
        } = this.state;

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
                    {this.renderGame()}
                </GameContainer>
            </GameContextProvider>
        ) : (
            <div>Loading...</div>
        );
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
