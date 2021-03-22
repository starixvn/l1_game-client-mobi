import React from "react"
import io from "socket.io-client"

import { AuthContext } from "../../contexts/auth"
import { GameBaseProps, GameBaseState, GameConfigs, GameState } from "./type"

class GameBase<P extends GameBaseProps, S extends GameBaseState> extends React.Component<P, S> {
    private socket: SocketIOClient.Socket;

    constructor(props: P) {
        super(props);
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
            this.setState({ signedIn: true });
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
        this.setState({ gameConfigs });
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
        this.setState({ gameState: GameState.DisplayResult });
    }

    placeBet(betChoice: string, amount: number) {
        this.socket.emit("bet", { betChoice, amount });
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
