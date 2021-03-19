import React from "react";
import io from "socket.io-client";

import { AuthContext } from "../../contexts/auth";
import BetTable from "../bet-table/bet-table";
import GameHeader from "../game-header/game-header";
import { GameConfigs, GameSettings, GameState } from "./type";
import RoadMapStatistic from "../road-map-statistic/road-map-statistic";

type State = {
  signedIn: boolean;
  gameState: GameState;
  remainingTime: number;
  gameConfigs: GameConfigs;
  roundHistory: any[];
  roundId: number;
};

class GameContainer extends React.Component<GameSettings, State> {
  private socket: SocketIOClient.Socket;
  constructor(props: GameSettings) {
    super(props);

    this.state = {
      signedIn: false,
      gameState: GameState.None,
      remainingTime: 0,
      gameConfigs: null,
      roundHistory: [],
      roundId: 0,
    };
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

    if (
      remainingTime <= durations.placingBets &&
      remainingTime > durations.lockingBet
    ) {
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

  render() {
    const { gameName } = this.props;
    const {
      gameState,
      remainingTime,
      roundId,
      signedIn,
      roundHistory,
    } = this.state;
    return signedIn ? (
      <div className="game">
        <GameHeader
          gameName={gameName}
          roundId={roundId}
          gameState={gameState}
          remainingTime={remainingTime}
        />
        <BetTable></BetTable>
        <RoadMapStatistic
          results={roundHistory}
          gameState={gameState}
        ></RoadMapStatistic>
        {this.props.children}
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

GameContainer.contextType = AuthContext;

export default GameContainer;
