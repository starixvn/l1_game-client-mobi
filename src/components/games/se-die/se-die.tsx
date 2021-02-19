import React from "react";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";

export default function SeDie() {
  return (
    <div>
      Se Die
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
