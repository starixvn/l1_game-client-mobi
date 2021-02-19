import React from "react";
import CountdownTimer from "../countdown-timer/countdown-timer";

type Props = {
  gameName: string;
  roundId: number;
  gameState: number;
  remainingTime: number;
};

export default function GameHeader(props: Props) {
  const { gameName, roundId, gameState, remainingTime } = props;

  return (
    <div>
      <h3>{gameName}</h3>
      <p>Draw No. {roundId}</p>
      <CountdownTimer
        remainingTime={remainingTime}
        key={gameState}
      ></CountdownTimer>
    </div>
  );
}
