import React from "react";
import Styles from "./se-die.module.scss";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";

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
    </div>
  );
}
