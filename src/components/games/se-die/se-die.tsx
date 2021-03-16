import React, {useEffect, useState} from "react";
import styles from "./se-die.module.scss";
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
 

  useEffect(() => {
    if(isSSO && isFirstLoad){
      updateState(false);
    }
  });

  const betChoiceNameMapper = {
    odd: "Odd",
    even: "Even",
  };

  const fakeData = ["odd", "even", "even", "even", "odd"];

  return (
    <div className={styles.container}>
      <GameHeader
        gameName="SieDie"
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
