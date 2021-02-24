import React from "react";
import Styles from "./se-die.module.scss";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";
import RoadMapStatistic from "../../shared/road-map-statistic/road-map-statistic";

export default function SeDie() {
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
