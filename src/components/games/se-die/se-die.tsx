import React, {useEffect, useState} from "react";
import Styles from "./se-die.module.scss";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";
import RoadMapStatistic from "../../shared/road-map-statistic/road-map-statistic";
import { initSockets } from "../../../common/socket";
import configs from "../../../../Configs";
import * as UrlHelper from "../../../helpers/UrlHelper";

type Props = {
  isSSO: boolean;
};

export default function SeDie(props: Props) {
  const { isSSO} = props;
  const [isFirstLoad, updateState] = useState<boolean>(true);
  const gameServerUrl = UrlHelper.buildServerUrl(configs.ssl, "http", "", 1, "localhost");
  const proxyRoute = configs.serverGameEndPoints[1].proxyRoute;
  const onConnectFailed = () => {};
 

  useEffect(() => {
    if(isSSO && isFirstLoad){
      initSockets(
        gameServerUrl,
        "",
        proxyRoute,
        onConnectFailed
      );
      updateState(false);
    }
  });

  return (
    <div className={Styles.container}>
      <GameHeader
        gameName="SieDie"
        roundId={13}
        gameState={1}
        remainingTime={40}
      ></GameHeader>
      <BetTable></BetTable>
      <RoadMapStatistic></RoadMapStatistic>
    </div>
  );
}
