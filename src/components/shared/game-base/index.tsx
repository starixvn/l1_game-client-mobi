import React from "react";
import io from "socket.io-client";

import { AuthContext } from "../../contexts/auth";
import { GameContextProvider } from "../../contexts/game-context/game-context";
import GameContainer from "../../shared/game-container";
import { GameBaseProps, GameBaseState, GameConfigs, GameState } from "./type";

abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.Component<P, S> {
    protected socket: SocketIOClient.Socket;

    constructor(props: P) {
        super(props);

        this.placeBet = this.placeBet.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
    }

    componentDidMount() {
        const { socketInfo } = this.props;

        this.socket = io(socketInfo.uri, {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: socketInfo.proxyRoute,
        });
        this.socket.on("connect", () => {
            this.socket.emit("signin", this.context);
        });
        this.socket.on("signedIn", () => {
            this.socket.emit("inGame");
        });

        this.socket.on(this.props.gameName, this.handleEvent.bind(this));
    }

    componentWillUnmount() {
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
    }

    handleUM(isUM: boolean) {
        if (isUM) {
            this.setState({ gameState: GameState.Disabled });
        }
    }

    handleRemainingTime(remainingTime: number) {
        const gameState = this.determineGameState(remainingTime);
        this.setState({ remainingTime, gameState });
    }

    handleGameConfigs(gameConfigs: GameConfigs) {
        this.setState({ gameConfigs, signedIn: true });
    }

    determineGameState(remainingTime: number) {
        const { durations } = this.props;

        if (remainingTime > durations.placingBets) {
            return GameState.Waiting;
        }

        if (remainingTime <= durations.placingBets && remainingTime > durations.lockingBet) {
            return GameState.InRound;
        }

        if (remainingTime <= durations.lockingBet) {
            return GameState.LockingBet;
        }

        return GameState.None;
    }

    handleRoundHistory(roundHistory) {
        const { gameState } = this.state;
        const lastRoundId = roundHistory[0] ? roundHistory[0].roundId : 0;
        this.setState({
            roundHistory,
            roundId: gameState === GameState.InRound ? lastRoundId + 1 : lastRoundId,
        });
    }

    handleFinish(finish) {
        const { roundHistory } = this.state;
        roundHistory.unshift(finish);
        roundHistory.pop();
        this.setState({
            gameState: GameState.DisplayResult,
            roundHistory,
            result: finish.result,
            settlementResult: finish.settlementResult,
        });
    }

    placeBet(betChoice: string, amount: number) {
        this.socket.emit("bet", { betChoice, amount });
    }

    updateGameState(gameState: GameState) {
        this.setState({ gameState });
    }

    abstract renderGame(): React.ReactElement;

    render() {
        const { gameName, id } = this.props;
        const { remainingTime, roundId, gameState, signedIn, totalBets, ownBets } = this.state;

        const gameContext = {
            placeBet: this.placeBet,
            updateGameState: this.updateGameState,
            totalBets,
            ownBets,
        };

        return signedIn ? (
            <GameContextProvider value={gameContext}>
                <GameContainer gameId={id} gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
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
