import React from "react";
import styles from "./se-die.module.scss";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";
import RoadMapStatistic from "../../shared/road-map-statistic/road-map-statistic";
import { initSockets } from "../../../common/socket";
import configs from "../../../../Configs";
import * as UrlHelper from "../../../helpers/UrlHelper";

type State = {
  gameName: string;
  roundId: number;
  remainingTime: number;
  gameState: number;
  showDisconnected: boolean;
};

export default class SeDie extends React.Component {
  public state: State;

  constructor(props) {
    super(props);

    this.state = {
      gameName: "SeDie",
      roundId: 13,
      remainingTime: 40,
      gameState: 1,
      showDisconnected: false,
    };
  }

  async componentDidUpdate(prevProps) {
    const gameServerUrl = UrlHelper.buildServerUrl(
      configs.ssl,
      "http",
      "",
      1,
      "localhost"
    );
    const proxyRoute = configs.serverGameEndPoints[1].proxyRoute;
    const nameSocket = "XocXoc";
    const onConnectFailed = () => {};

    const socket = initSockets(gameServerUrl, "", proxyRoute, onConnectFailed());

    if(socket){
      socket.on(nameSocket, (data) => {});
    }
    
  }

  showWebSocketDisconnected() {
    this.setState({ showDisconnected: true });
  }

  render() {
    const betChoiceNameMapper = {
      odd: "Odd",
      even: "Even",
    };

    const fakeData = ["odd", "even", "even", "even", "odd"];

    return (
      <div className={styles.container}>
        <GameHeader
          gameName="SeDie"
          roundId={13}
          gameState={1}
          remainingTime={40}
        ></GameHeader>
        <BetTable></BetTable>
        <RoadMapStatistic
          results={fakeData}
          isWaitingResult={false}
        ></RoadMapStatistic>
      </div>
    );
  }
}
